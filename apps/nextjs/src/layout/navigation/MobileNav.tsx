import { Flex, IconButton, type FlexProps, Text, HStack, Menu, MenuButton, Avatar, VStack, MenuList, useColorModeValue, MenuItem, MenuDivider, Heading, Icon } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling";
import { Link } from "@chakra-ui/next-js"
import { FiSearch } from "react-icons/fi";

type MobileProps = FlexProps

export const MobileNav = ({ ...rest }: MobileProps) => {
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
        <Link href="/">
          Evy ⚡️
        </Link>
      </Heading>

      <HStack spacing={0}>
        <IconButton
          variant='ghost'
          size='lg'
          aria-label="search"
          icon={<Icon as={FiSearch} />}
        />
      </HStack>
    </Flex>
  )
}