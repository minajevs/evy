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

  const bg = useBackgroundColor('page')
  const [bgHex] = useToken('colors', [bg])

  if (fade)
    return `linear-gradient(
      rgba(255,255,255,0),
      ${bgHex}
    ), ${backgroundPattern(fill, translateY)}`

  return `/**/${backgroundPattern(fill, translateY)}`
}
