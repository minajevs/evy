import { env } from '../env.mjs'
import { prisma } from '@evy/db'
import { encode, decode } from 'next-auth/jwt'
import { type DefaultSession, type NextAuthOptions } from 'next-auth'
import GitHubProvider, { type GithubProfile } from 'next-auth/providers/github'
import { slugify } from './slugify'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from './verifyPassword'
import { ErrorCodes } from './errorCodes'
import { getAdapter } from './adapter'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { customAlphabet } from 'nanoid'
import Cookies from 'cookies'

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      createdAt: Date
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  interface User {
    //   // ...other properties
    createdAt: Date
  }
}

const randomId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-',
  24,
)
const session = {
  // strategy: "database",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions = (
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions => {
  const adapter = getAdapter()

  return {
    adapter: {
      ...adapter,
    },
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id
          // session.user.role = user.role; <-- put other properties on the session here
        }
        return session
      },
      // Custom hook to set session on credentials login
      async signIn({ user }) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          if (user && 'id' in user) {
            const sessionToken = randomId()
            const sessionExpiry = new Date(Date.now() + session.maxAge * 1000)
            await adapter.createSession?.({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            })
            const cookies = Cookies(req, res)
            cookies.set('next-auth.session-token', sessionToken, {
              expires: sessionExpiry,
            })
          }
        }
        return true
      },
    },
    // needs to override default jwt behavior when using Credentials
    jwt: {
      encode(params) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          const cookies = new Cookies(req, res)
          const cookie = cookies.get('next-auth.session-token')
          if (cookie) return cookie
          else return ''
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode(params)
      },
      decode(params) {
        if (
          req.query.nextauth?.includes('callback') &&
          req.query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          return null
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return decode(params)
      },
    },
    providers: [
      GitHubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        profile(profile: GithubProfile) {
          const username = slugify(profile.name ?? profile.login)
          const fullUsername = `${username}-${profile.id}`
          return {
            // taken from provider source
            // https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/github.ts
            id: profile.id.toString(),
            username: fullUsername,
            name: profile.name,
            email: profile.email,
            image: profile.avatar_url,
            // custom props
            createdAt: new Date(),
          }
        },
      }),
      CredentialsProvider({
        id: 'credentials',
        name: 'evy.app',
        type: 'credentials',
        credentials: {
          email: {
            label: 'Email Address',
            type: 'email',
            placeholder: 'john.doe@example.com',
          },
          password: {
            label: 'Password',
            type: 'password',
            placeholder: 'Your super secure password',
          },
        },
        async authorize(credentials, req) {
          if (credentials === null || credentials === undefined) {
            console.error('Credentials are missing')
            throw new Error(ErrorCodes.CredentialsMissing)
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
          })

          // Do not leak if email or password is incorrect
          if (user === null) {
            throw Error(ErrorCodes.IncorrectEmailPassword)
          }

          // TODO: Ratelimit requests

          if (!credentials.password || !user.password) {
            throw Error(ErrorCodes.IncorrectEmailPassword)
          }

          const correctPassword = await verifyPassword(
            credentials.password,
            user.password,
          )

          if (!correctPassword) {
            throw Error(ErrorCodes.IncorrectEmailPassword)
          }

          return user
        },
      }),
    ],
    pages: {
      signIn: '/auth/signin',
    },
  }
}
