import { Box, Button, Divider, Flex, HStack, Heading, Icon, IconButton, type LinkProps, Stack, VStack, useColorMode, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { signIn } from "next-auth/react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Moon, Sun, X, Menu } from "lucide-react"
import { EvyLogo } from "../logo/EvyLogo"
import { Link } from "@chakra-ui/next-js"
import styled from "@emotion/styled"

const StyledLink = styled(Link)`
  text-decoration: none;
  &:focus, &:hover, &:visited, &:link, &:active {
    text-decoration: none;
  }
`;

type Props = {
  signedIn: boolean
}
export const Navbar = ({ signedIn }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [parent] = useAutoAnimate({ easing: 'ease-in-out' })

  const boldBorder = useBackgroundColor('bold-border')
  const navigation = useBackgroundColor('navigation')
  const page = useBackgroundColor('page')

  return <Box ref={parent}>
    <Flex maxW='1440' height={100} px={{ base: 4, md: 8 }} py={6} mx="auto">
      <Box px={4} width='100%'>
        <Flex h={12} alignItems="center" justifyContent="space-between" mx="auto">
          {/* Heading */}
          <Heading size="lg" justifyContent='flex-start' w={150}>
            <Link href="/" _hover={{ textDecoration: 'none' }}>
              <EvyLogo />
            </Link>
          </Heading>

          {/* Desktop menu  */}
          <HStack
            display={{ base: 'none', md: 'flex' }}
            alignItems="center"
            spacing={8}
            px={12}
            py={4}
            borderRadius={40}
            borderWidth={2}
            borderColor={boldBorder}
            bg={navigation}
            boxShadow='lg'
          >
            <NavLink name="Features" href="/" />
            <NavLink name="About" href="/" />
            <NavLink name="Pricing" href="/" />
          </HStack>

          {/* Buttons */}
          <HStack w={150} justifyContent='end'>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <Icon as={Moon} /> : <Icon as={Sun} />}
            </Button>
            {
              signedIn
                ? <Button
                  as={StyledLink}
                  href='/my'
                  display={{ base: 'none', md: 'inherit' }}
                  colorScheme="primary"
                >
                  Go to app
                </Button>
                : <Button
                  display={{ base: 'none', md: 'inherit' }}
                  colorScheme="primary"
                  onClick={() => void signIn()}
                >
                  Sign in
                </Button>
            }
            <IconButton
              size="md"
              icon={isOpen ? <Icon as={X} /> : <Icon as={Menu} />}
              aria-label="Open Menu"
              display={{ base: 'inherit', md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
          </HStack>
        </Flex>
      </Box>
    </Flex>
    {/* Mobile Menu */}
    {isOpen ? (
      <Box
        p={4}
        display={{ base: 'inherit', md: 'none' }}
        bg={page}
        borderWidth={2}
        borderColor={boldBorder}
        borderX={0}
      >
        <Stack
          as="nav"
          alignItems='center'
          spacing={8}
          fontSize='lg'
        >
          <NavLink name="Features" href="/" />
          <NavLink name="About" href="/" />
          <NavLink name="Pricing" href="/" />

          <Divider mt={16} />
          <VStack>
            <Heading fontSize=''>
              Existing user?
            </Heading>
            {
              signedIn
                ? <Button
                  as={StyledLink}
                  href='/my'
                  colorScheme="primary"
                >
                  Go to app
                </Button>
                : <Button
                  colorScheme="primary"
                  onClick={() => void signIn()}>
                  Sign in
                </Button>
            }
          </VStack>
        </Stack>
      </Box>
    ) : null}
  </Box>
}

type NavLinkProps = {
  name: string
  href: string
} & LinkProps
const NavLink = ({ name, href, ...rest }: NavLinkProps) => {
  return (
    <Link
      href={href}
      lineHeight="inherit"
      _hover={{
        textDecoration: 'none',
        color: useColorModeValue('primary.500', 'primary.200')
      }}
      {...rest}
    >
      {name}
    </Link>
  );
}