import { z } from 'zod'
import { textLengths, urlSafeRegex } from './validation'

export const slugSchema = z
  .string()
  .regex(
    urlSafeRegex,
    'Slug may only contain alphanumeric characters, single hyphen or underscore, and cannot begin or end with a hyphen or underscore',
  )
  .max(textLengths.normal)
