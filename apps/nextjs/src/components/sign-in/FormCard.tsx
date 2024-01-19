import { VStack } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { z } from "zod"

export const signinFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
})

type Props = {
  children: React.ReactNode
  onSubmit: () => void
}
export const FormCard = ({ children, onSubmit }: Props) => {
  return <VStack
    as="form"
    boxSize={{ base: 'xs', sm: 'sm', md: 'md' }}
    h="max-content !important"
    bg={useBackgroundColor('navigation')}
    rounded="lg"
    boxShadow="lg"
    p={{ base: 5, sm: 10 }}
    onSubmit={onSubmit}
  >
    {children}
  </VStack>
}