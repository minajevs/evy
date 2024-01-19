import { env } from '../env.mjs'
import { type NextAuthOptions, type DefaultSession } from 'next-auth'
import GitHubProvider, { type GithubProfile } from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import { slugify } from './slugify'
import { getAdapter } from './adapter'
import { Client } from 'postmark'

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

const adapter = getAdapter()
const postmarkClient = () => new Client(env.POSTMARK_API_TOKEN)

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
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
  },
  providers: [
    EmailProvider({
      server: {
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        auth: {
          user: env.POSTMARK_API_TOKEN,
          pass: env.POSTMARK_API_TOKEN,
        },
      },
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const result = await postmarkClient().sendEmailWithTemplate({
          TemplateAlias: 'magic-link',
          To: identifier,
          From: provider.from,
          TemplateModel: {
            product_url: 'https://evy.app',
            product_name: 'Evy.app',
            action_url: url,
            user_email: identifier,
          },
        })

        if (result.ErrorCode) {
          throw new Error(result.Message)
        }
      },
    }),
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
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile: GoogleProfile) {
        const username = slugify(profile.name ?? profile.login)
        const fullUsername = `${username}-${profile.sub}`
        return {
          id: profile.sub,
          username: fullUsername,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
}
