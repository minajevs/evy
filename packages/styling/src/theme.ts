import {
  type ThemeConfig,
  extendTheme,
  type ThemeOverride,
  type RecursiveObject,
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

export const getTheme = (fonts?: RecursiveObject<string>) =>
  extendTheme(
    {
      fonts: fonts ?? {},
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
        Link: {
          baseStyle: {
            textDecoration: 'none',
            _focus: {
              textDecoration: 'none',
            },
            _hover: {
              textDecoration: 'none',
            },
            _visited: {
              textDecoration: 'none',
            },
            _activeLink: {
              textDecoration: 'none',
            },
            _active: {
              textDecoration: 'none',
            },
          },
        },
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
