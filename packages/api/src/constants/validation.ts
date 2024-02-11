// alphanumeric characters, single hyphen, underscore, dot
export const urlSafeRegex = /^[a-zA-Z0-9]([-_.]?[a-zA-Z0-9])*$/

export const textLengths = {
  short: 12,
  normal: 60,
  long: 300,
} as const
