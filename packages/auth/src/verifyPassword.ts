import { compare } from 'bcryptjs'

export const verifyPassword = async (password: string, hash: string) => {
  return await compare(password, hash)
}
