import { Link } from "@chakra-ui/next-js"
import { Button, type ButtonProps, Flex, type FlexProps, Text } from "@chakra-ui/react"

type BaseNavItemProps = {
  children: React.ReactNode
} & ButtonProps

export const NavItemBase = ({ children, ...rest }: BaseNavItemProps) => {
  return <Button
    textAlign='left'
    width='100%'
    justifyContent='flex-start'
    borderRadius="0"
    variant='ghost'
    px='8'
    height='12'
    {...rest}>
    <Text>{children}</Text>
  </Button>
}

type NavItemProps = {
  href: string
} & BaseNavItemProps

export const NavItemLink = (props: NavItemProps) => {
  return (
    <Link href={props.href}>
      <NavItemBase {...props} />
    </Link>
  )
}