import { Button, Icon, useBoolean } from "@chakra-ui/react"
import { Github } from "lucide-react"
import { signIn } from "next-auth/react"


type Props = {
  disabled: boolean
  onClick: () => void
}
export const GithubProviderButton = ({ onClick, disabled }: Props) => {
  const [loading, { on }] = useBoolean(false)
  return <Button
    isLoading={loading}
    isDisabled={loading || disabled}
    w='100%'
    variant='outline'
    onClick={() => {
      on()
      onClick()
      return signIn('github')
    }}>
    <Icon as={Github} mr={4} /> Sign in with GitHub
  </Button>
}