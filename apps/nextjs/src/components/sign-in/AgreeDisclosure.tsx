import { Link } from "@chakra-ui/next-js"
import { Box } from "@chakra-ui/react"

export const AgreeDisclosure = () => {
  return <Box>
    By signing up you agree to our <Link href="/terms" color="teal">terms</Link> and <Link href="/privacy" color="teal">privacy</Link> policy.
  </Box>
}