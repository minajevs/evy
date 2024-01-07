import { type ThemeConfig, extendTheme, type Colors } from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'

const colors: Colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
// const Input = defineStyleConfig({
//   baseStyle: {
//     background: 'white',
//   },
// })

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}

export const theme = extendTheme(
  {
    colors,
    config,
  },
  withProse({
    baseStyle: {
      p: {
        margin: 0,
      },
      a: {
        textDecoration: 'underline',
      },
    },
  }),
)
