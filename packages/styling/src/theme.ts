import {
  type ThemeConfig,
  extendTheme,
  type ThemeOverride,
} from '@chakra-ui/react'
import { withProse } from '@nikolovlazar/chakra-ui-prose'

import { colors } from './colors'

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
    semanticTokens: {
      colors: {
        primary: {
          default: 'primary.500',
          _dark: 'primary.300',
        },
      },
    },
    colors,
    config,
    components: {
      Text: {
        variants: {
          // used as <Text variant="primary">
          primary: {
            color: 'primary',
          },
        },
      },
    },
  } as ThemeOverride,
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
