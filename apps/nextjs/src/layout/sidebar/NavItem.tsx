import { Link } from "@chakra-ui/next-js"
import { Flex, type FlexProps } from "@chakra-ui/react"

type BaseNavItemProps = {
  children: React.ReactNode
} & FlexProps

export const NavItemBase = ({ children, ...rest }: BaseNavItemProps) => {
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

type NavItemProps = {
  href: string
} & BaseNavItemProps

export const NavItemLink = (props: NavItemProps) => {
  return (
    <Link href={props.href} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <NavItemBase {...props} />
    </Link>
  )
}