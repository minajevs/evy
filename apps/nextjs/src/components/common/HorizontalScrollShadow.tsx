import { Box, Flex, useToken, type FlexProps, useColorModeValue } from "@chakra-ui/react"
import { type ReactNode, type RefObject, type WheelEvent, useEffect, useRef, useState } from "react"

type Props = {
  children: ReactNode
} & FlexProps
export const HorizontalScrollShadow = ({ children, ...rest }: Props) => {
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)
  const [clientWidth, setClientWidth] = useState(0)

  const onScrollHandler = (event: WheelEvent<HTMLDivElement>) => {
    setScrollLeft(event.currentTarget.scrollLeft)
    setScrollWidth(event.currentTarget.scrollWidth)
    setClientWidth(event.currentTarget.clientWidth)
  }

  const wrapperRef = useRef<HTMLDivElement>(null)

  const bg = useColorModeValue('white', 'gray.700')
  const hover = useColorModeValue('gray.200', 'gray.600')
  const [bgHex, hoverHex] = useToken('colors', [bg, hover])


  useEffect(() => {
    const resetRefSizes = (ref: RefObject<HTMLDivElement>) => {
      if (!ref.current) return

      setScrollLeft(ref.current.scrollLeft)
      setScrollWidth(ref.current.scrollWidth)
      setClientWidth(ref.current.clientWidth)
    }

    resetRefSizes(wrapperRef)
  }, [wrapperRef?.current?.clientWidth])


  const getVisibleSides = (): { left: boolean; right: boolean } => {
    const isLeft = scrollLeft === 0
    const isRight = clientWidth === scrollWidth - scrollLeft
    const isBetween = scrollLeft > 0 && clientWidth < scrollWidth - scrollLeft

    return {
      left: (isRight || isBetween) && !(isLeft && isRight) && scrollWidth > clientWidth,
      right: scrollWidth === 0 || (isLeft || isBetween) && !(isLeft && isRight) && scrollWidth > clientWidth,
    }
  }
  const sides = getVisibleSides()

  return (
    <Flex
      {...rest}
      ref={wrapperRef}
      onScroll={onScrollHandler}
      position='relative'
    >
      <Box
        zIndex={1}
        id='shadow-left'
        position='sticky'
        left={0}
        boxShadow={`inset 32px 0px 16px -16px ${bgHex}`}
        _groupHover={{
          boxShadow: `inset 32px 0px 16px -16px ${hoverHex}`
        }}
        width={16}
        mr={-16}
        flexShrink={0}
        pointerEvents='none'
        opacity={sides.left ? 1 : 0}
        justifyContent='end'
        transition='opacity 0.3s'
      />
      {children}
      <Box
        zIndex={1}
        id='shadow-right'
        position='sticky'
        right={0}
        boxShadow={`inset -32px 0px 16px -16px ${bgHex}`}
        _groupHover={{
          boxShadow: `inset -32px 0px 16px -16px ${hoverHex}`
        }}
        width={16}
        ml={-16}
        flexShrink={0}
        pointerEvents='none'
        opacity={sides.right ? 1 : 0}
        transition='opacity 0.3s'
      />
    </Flex>
  )
}