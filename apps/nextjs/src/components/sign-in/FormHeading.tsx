import { Stack, Text, Heading } from "@chakra-ui/react"

type Props = {
  show: boolean
}
export const FormHeading = ({ show }: Props) => (
  <Stack align="center" opacity={show ? 1 : 0}>
    <Heading fontSize="3xl">Welcome!</Heading>
    <Text fontSize="xl">Create an account or login</Text>
  </Stack>)