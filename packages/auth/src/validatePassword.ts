export type ValidationResult = {
  min?: boolean
  uppercase?: boolean
  lowercase?: boolean
  number?: boolean
}

export const validatePassword = (password: string): ValidationResult => {
  return {
    min: password.length >= 8,
    uppercase: password.match(/[A-Z]/) !== null,
    lowercase: password.match(/[a-z]/) !== null,
    number: password.match(/\d/) !== null,
  }
}

export const isPasswordValid = (password: string): boolean => {
  const result = validatePassword(password)
  return (
    !!result.min && !!result.uppercase && !!result.lowercase && !!result.number
  )
}
