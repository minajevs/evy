import { Box, type BoxProps, Icon } from "@chakra-ui/react"
import { Evy } from "../common/icons/Evy"

type Props = BoxProps
export const EvyLogo = ({ ...props }: Props) => <Box
  fontFamily='onest'
  display='flex'
  alignItems='center'
  {...props}>
  <Icon as={Evy} mx={1} color='primary.500' /> Evy
</Box>