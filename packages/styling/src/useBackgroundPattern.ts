import { useBackgroundColor } from './useBackgroundColor'
import { useToken } from '@chakra-ui/react'
import { backgroundPattern } from './backgroundPattern3'

type Props = {
  fill?: string
  translateY?: number
  fade?: boolean
}

export const useBackgroundPattern = (props?: Props) => {
  const fill = props?.fill ?? 'primary.500'
  const translateY = props?.translateY ?? 0
  const fade = props?.fade ?? false

  const opacity = 0.1

  const bg = useBackgroundColor('page')
  const [bgHex, fillHex] = useToken('colors', [bg, fill])

  if (fade)
    return `linear-gradient(
      180deg,
      rgba(255,255,255,0) 50%,
      ${bgHex} 100%
    ), ${backgroundPattern(fillHex.replace('#', ''), opacity, translateY)}`

  return `/**/${backgroundPattern(
    fillHex.replace('#', ''),
    opacity,
    translateY,
  )}`
}
