import { Icon, Button, Text } from "@chakra-ui/react"
import { Heading, Inbox, ArrowLeft } from "lucide-react"

type Props = {
  onBack: () => void
}
export const MagicLinkConfirmation = ({ onBack }: Props) => {
  return <>
    <Heading fontSize='2xl'>We've sent you a magic link!</Heading>
    <Icon as={Inbox} boxSize='66' color='teal' />
    <Text textAlign='center'>
      Check your inbox for an email which contains a magic link that will log you in to your account.
    </Text>
    <Button mt={8} variant='ghost' leftIcon={<Icon as={ArrowLeft} />} onClick={onBack}> Back</Button>
  </>
}