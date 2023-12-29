import { Link } from "@chakra-ui/next-js"
import { Box, Container, Divider, HStack, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"


export const Footer = () => {
  return <Box
    p={12}
    m={12}
    borderRadius={40}
    borderWidth={2}
    borderColor={useBackgroundColor('bold-border')}
    bg={useBackgroundColor('navigation')}>
    <HStack spacing={16} alignItems='start' justifyContent='space-between'>
      <VStack alignItems='start'>
        <Heading size='md' mb={4}>Evy</Heading>
        <Text>
          Evy is an app to manage, overview, track, share and discover precious hobbies
        </Text>
        <Text fontWeight={700} color={useColorModeValue('gray.500', 'gray.300')}>
          2024
        </Text>
      </VStack>
      <HStack mt='0' spacing={16}>
        <VStack alignItems='start'>
          <Heading size="sm" mb={4}>
            Links
          </Heading>
          <Link href="/">About</Link>
          <Link href="/">Features</Link>
          <Link href="/">Pricing</Link>
        </VStack>
      </HStack>
    </HStack>
  </Box>
}