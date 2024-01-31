import { Flex, type FlexProps, HStack, Heading, Icon, useColorMode, IconButton } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling";
import { Link } from "@chakra-ui/next-js"
import { useSession } from "next-auth/react"
import { Moon, Sun } from "lucide-react"
import { EvyLogo } from "~/components/logo/EvyLogo";
import { ProfileNavButton } from "~/components/profile/ProfileNavButton";

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
          <IconButton aria-label="change dark or light mode" icon={colorMode === 'light' ? <Icon as={Moon} /> : <Icon as={Sun} />} isRound variant='ghost' onClick={toggleColorMode} />
          <ProfileNavButton />
        </HStack>
      </HStack>
    </Flex>
  )
}