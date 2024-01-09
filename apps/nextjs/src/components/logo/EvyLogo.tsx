import { Box, type BoxProps, Icon } from "@chakra-ui/react"
import { Library } from "lucide-react"
import localFont from "next/font/local"

const logoFont = localFont({
  src: '../../../public/Onest-VariableFont_wght.ttf',
  preload: true
})


type Props = BoxProps
export const EvyLogo = ({ ...props }: Props) => <Box
  className={logoFont.className}
  display='flex'
  alignItems='center'
  {...props}>
  Evy <Icon as={Library} mx={1} />
</Box>