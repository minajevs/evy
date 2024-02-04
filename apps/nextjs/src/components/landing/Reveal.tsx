import { Fade, useDisclosure } from "@chakra-ui/react"
import { type ReactNode, useEffect } from "react"

type Props = {
  children: ReactNode
}
export const Reveal = ({ children }: Props) => {
  const { isOpen, onOpen } = useDisclosure()

  useEffect(onOpen, [])

  return <Fade in={isOpen} unmountOnExit={false} transition={{ enter: { duration: 0.1, ease: 'easeInOut' } }}>
    {children}
  </Fade>
}