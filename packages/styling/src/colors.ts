import { type Colors, type DeepPartial } from '@chakra-ui/react'

// https://palette.saas-ui.dev/
// https://uicolors.app/create
export const colors = {
  black: '#100f10',
  gray: {
    '50': '#fafafa',
    '100': '#f1f1f1',
    '200': '#e7e7e8',
    '300': '#d4d4d4',
    '400': '#adacad',
    '500': '#7f7f80',
    '600': '#555456',
    '700': '#373638',
    '800': '#202021',
    '900': '#1a191b',
  },
  red: {
    '50': '#fff5f5',
    '100': '#ffd7d7',
    '200': '#feb2b2',
    '300': '#fe8080',
    '400': '#fd5d5d',
    '500': '#ea3636',
    '600': '#c72e2e',
    '700': '#a02525',
    '800': '#881f1f',
    '900': '#631717',
  },
  // Primary - pink salmon
  // #ff98a5
  // analagous to peach fuzz (pantone color of the year 2024)
  primary: {
    '50': '#fff1f2',
    '100': '#ffe3e5',
    '200': '#ffccd2',
    '300': '#ff98a5',
    '400': '#fe6e83',
    '500': '#f83b5b',
    '600': '#e51947',
    '700': '#c20e3a',
    '800': '#a20f38',
    '900': '#8b1036',
    '950': '#4e0318',
  },
  secondary: {
    '50': '#f0f6ff',
    '100': '#e0f0ff',
    '200': '#b8e0ff',
    '300': '#99daff',
    '400': '#35befd',
    '500': '#09acec',
    '600': '#008fcc',
    '700': '#0078a3',
    '800': '#046786',
    '900': '#0a5a71',
    '950': '#063c4b',
  },
} satisfies DeepPartial<Colors>
