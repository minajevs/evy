export const slugify = (text: string) =>
  text
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .toLocaleLowerCase()
    .replace(/\s+/g, '-') // separator
