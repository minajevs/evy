import prisma from '@evy/db'

export const checkUsernameAvailable = async (username: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
  })
  return existingUser === null
}
