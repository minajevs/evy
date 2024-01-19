import { Button, Icon, useBoolean } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import { Google } from "~/components/common/icons/Google"


type Props = {
  disabled: boolean
  onClick: () => void
}
export const GoogleProviderButton = ({ onClick, disabled }: Props) => {
  const [loading, { on }] = useBoolean(false)
  return <Button
    isLoading={loading}
    isDisabled={loading || disabled}
    w='100%'
    variant='outline'
    onClick={() => {
      on()
      onClick()
      return signIn('google')
    }}>
    <Icon as={Google} mr={4} /> Sign in with Google
  </Button>
}