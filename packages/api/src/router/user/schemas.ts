import { z } from 'zod'
import { urlSafeRegex } from '../../utils/urlSafeRegex'

export const editUserSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must contain at least 5 characters')
    .regex(
      urlSafeRegex,
      'Username may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
  name: z.string(),
})

export const verifyUsernameSchema = z.object({
  username: z
    .string()
    .min(5)
    .regex(
      urlSafeRegex,
      'Username may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
})
