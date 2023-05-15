import { useColorModeValue } from '@chakra-ui/react'

type BackgroundTypes = 'page' | 'navigation' | 'bold-border'

const backgroundValueMap: Record<BackgroundTypes, [string, string]> = {
  page: ['gray.100', 'gray.900'],
  navigation: ['gray.50', 'gray.900'],
  'bold-border': ['gray.200', 'gray.700'],
}

export const useBackgroundColor = (type: BackgroundTypes) =>
  useColorModeValue(backgroundValueMap[type][0], backgroundValueMap[type][1])
