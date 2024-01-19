import { Button, Icon, useBoolean } from "@chakra-ui/react"
import { signIn } from "next-auth/react"
import { Discord } from "~/components/common/icons/Discord"


type Props = {
  disabled: boolean
  onClick: () => void
}
export const DiscordProviderButton = ({ onClick, disabled }: Props) => {
  const [loading, { on }] = useBoolean(false)
  return <Button
    isLoading={loading}
    isDisabled={loading || disabled}
    w='100%'
    variant='outline'
    onClick={() => {
      on()
      onClick()
      return signIn('discord')
    }}>
    <Icon as={Discord} mr={4} /> Sign in with Discord
  </Button>
}