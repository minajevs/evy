import { z } from 'zod'
import { validatePassword } from './validatePassword'

// alphanumeric characters, single hyphen, underscore, dot
export const urlSafeRegex = /^[a-zA-Z0-9]([-_.]?[a-zA-Z0-9])*$/

// TODO: Harmonize with verify username schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(5)
    .regex(
      urlSafeRegex,
      'Username may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
    ),
  email: z.string().email(),
  password: z.string().superRefine((data, ctx) => {
    const result = validatePassword(data)
    Object.keys(result).map((key: string) => {
      if (!result[key as keyof typeof result]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: key,
        })
      }
    })
  }),
})
