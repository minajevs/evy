import { useBackgroundColor } from './useBackgroundColor'
import { useToken } from '@chakra-ui/react'
import { backgroundPattern } from './backgroundPattern3'

type Props = {
  bg?: string
  fill?: string
  translateY?: number
  fade?: boolean
  fadeBoth?: boolean
}

export const useBackgroundPattern = (props?: Props) => {
  const pageBg = useBackgroundColor('page')
  const bg = props?.bg ?? pageBg
  const fill = props?.fill ?? 'primary.500'
  const translateY = props?.translateY ?? 0
  const fade = props?.fade ?? false
  const fadeBoth = props?.fadeBoth ?? false

  const opacity = 0.1

  const [bgHex, fillHex] = useToken('colors', [bg, fill])

  if (fadeBoth)
    return `linear-gradient(
      180deg,
      ${bgHex} 0%,
      rgba(255,255,255,0) 33%,
      rgba(255,255,255,0) 66%,
      ${bgHex} 100%
    ), 
    ${backgroundPattern(fillHex.replace('#', ''), opacity, translateY)}
    `

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
