import { Link } from "@chakra-ui/next-js"
import { Box, Flex, HStack, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { EvyLogo } from "../logo/EvyLogo"


export const Footer = () => {
  return <Box
    p={12}
    m={{ base: 4, md: 12 }}
    borderRadius={40}
    borderWidth={2}
    borderColor={useBackgroundColor('bold-border')}
    bg={useBackgroundColor('navigation')}
    boxShadow='lg'
  >
    <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 8, md: 16 }} alignItems='start' justifyContent='start'>
      <VStack alignItems='start'>
        <EvyLogo />
        <Text>
          Evy is an app to manage, overview, track, share and discover precious hobbies
        </Text>
        <Text fontWeight={700} color={useColorModeValue('gray.500', 'gray.300')}>
          2024
        </Text>
      </VStack>
      <HStack mt='0' spacing={16}>
        {/* <VStack alignItems='start'>
          <Heading size="sm" mb={4}>
            About
          </Heading>
          <Link href="/">About</Link>
          <Link href="/">Features</Link>
          <Link href="/">Pricing</Link>
        </VStack> */}
        <VStack alignItems='start'>
          <Heading size="sm" mb={4}>
            Links
          </Heading>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="mailto:hello@evy.app">Contact us</Link>
        </VStack>
      </HStack>
    </Flex>
  </Box>
}