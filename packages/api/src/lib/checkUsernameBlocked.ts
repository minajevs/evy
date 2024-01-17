import usernameBlocklist from '../router/user/username-blocklist'

export const checkUsernameBlocked = (username: string) => {
  return usernameBlocklist.includes(username)
}
