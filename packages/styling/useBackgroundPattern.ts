import { useBackgroundColor } from './useBackgroundColor'
import { useToken } from '@chakra-ui/react'
import { backgroundPattern } from './backgroundPattern'

type Props = {
  fill?: string
  translateY?: number
  fade?: boolean
}

export const useBackgroundPattern = (props?: Props) => {
  const fill = props?.fill ?? '2C7A7B'
  const translateY = props?.translateY ?? 0
  const fade = props?.fade ?? false

  const opacity = 0.2

  const bg = useBackgroundColor('page')
  const [bgHex] = useToken('colors', [bg])

  if (fade)
    return `linear-gradient(
      180deg,
      rgba(255,255,255,0) 50%,
      ${bgHex} 100%
    ), ${backgroundPattern(fill, opacity, translateY)}`

  return `/**/${backgroundPattern(fill, opacity, translateY)}`
}
