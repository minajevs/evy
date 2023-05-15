import { Link } from "@chakra-ui/next-js";
import { Flex, type FlexProps } from "@chakra-ui/react";

type NavItemProps = {
  children: React.ReactNode
} & FlexProps

export const NavItem = ({ children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {children}
      </Flex>
    </Link>
  );
};