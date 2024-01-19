import { Flex, type FlexProps, HStack, Heading, Icon, useColorMode, Button } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling";
import { Link } from "@chakra-ui/next-js"
import { signIn, signOut, useSession } from "next-auth/react"
import { Moon, Sun } from "lucide-react"
import { EvyLogo } from "~/components/logo/EvyLogo";

type MobileProps = FlexProps

export const MobileNav = ({ ...rest }: MobileProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const session = useSession()
  const bg = useBackgroundColor('navigation')

  return (
    <Flex
      px={4}
      alignItems="center"
      bg={bg}
      justifyContent='space-between'
      borderBottom="1px"
      borderBottomColor={useBackgroundColor('bold-border')}
      boxShadow='md'
      h={16}
      {...rest}>
      <Heading size="lg" mx='4' justifyContent='flex-start'>
        <Link href="/" _hover={{ textDecoration: 'none' }}>
          <EvyLogo />
        </Link>
      </Heading>

      <HStack spacing={0}>
        {/* <IconButton
          variant='ghost'
          size='lg'
          aria-label="search"
          icon={<Icon as={FiSearch} />}
        /> */}
        <HStack spacing='0'>
          <Button variant='ghost' onClick={toggleColorMode}>
            {colorMode === 'light' ? <Icon as={Moon} /> : <Icon as={Sun} />}
          </Button>
          <Button justifyContent='flex-start' textAlign='left' variant='ghost' onClick={session.status === 'authenticated' ? () => void signOut({ callbackUrl: '/' }) : () => void signIn()}>
            {session.status === 'authenticated' ? "Sign out" : "Sign in"}
          </Button>
        </HStack>
      </HStack>
    </Flex>
  )
}