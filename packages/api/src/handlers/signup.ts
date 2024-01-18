import { type NextApiRequest, type NextApiResponse } from 'next'
import { signUpSchema } from '@evy/auth/src/signUpSchema'
import { checkUsernameAvailable } from '../lib/checkUsernameAvailable'
import { checkUsernameBlocked } from '../lib/checkUsernameBlocked'
import { prisma } from '@evy/db'
import { hashPassword } from '@evy/auth'
import { isPasswordValid } from '@evy/auth/src/validatePassword'

// TODO: Obsolete
export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405) // Method not allowed
  }

  const parseResult = signUpSchema.safeParse(req.body)

  if (!parseResult.success)
    return res.status(400).json({ message: 'Cannot parse body' })

  const { username, email, password } = parseResult.data

  if (!isPasswordValid(password)) {
    return res.status(400).json({ message: 'Password is too weak' })
  }

  if (!(await checkUsernameAvailable(username))) {
    return res.status(400).json({ message: 'Username is unavailable' })
  }

  if (checkUsernameBlocked(username)) {
    return res.status(400).json({ message: 'Username is unavailable' })
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  })

  if (existingUser !== null) {
    return res.status(400).json({ message: 'Email already exists' })
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    },
  })

  await prisma.account.create({
    data: {
      userId: user.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: user.id,
    },
  })

  res.status(201).json({ message: 'User created' })
}
