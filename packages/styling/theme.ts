import { defineStyle, defineStyleConfig, extendTheme } from '@chakra-ui/react'

const colors = {
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

export const theme = extendTheme({
  colors,
  // components: {
  //   Input,
  // },
})
