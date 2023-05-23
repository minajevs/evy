import { Link } from "@chakra-ui/next-js"
import { Flex, type FlexProps } from "@chakra-ui/react"

type NavItemProps = {
  children: React.ReactNode
} & FlexProps

export const NavItemBase = ({ children, ...rest }: NavItemProps) => {
  return <Flex
    align="center"
    p="4"
    mx="4"
    borderRadius="lg"
    role="group"
    cursor="pointer"
    _hover={{
      bg: 'brand.700',
      color: 'white',
    }}
    {...rest}>
    {children}
  </Flex >
}

export const NavItemLink = (props: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <NavItemBase {...props} />
    </Link>
  )
}