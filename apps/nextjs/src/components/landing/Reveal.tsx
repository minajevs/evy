import { Fade, useDisclosure } from "@chakra-ui/react"
import { type ReactNode, useEffect } from "react"

type Props = {
  children: ReactNode
}
export const Reveal = ({ children }: Props) => {
  const { isOpen, onToggle } = useDisclosure()

  useEffect(onToggle, [])

  return <Fade in={isOpen} unmountOnExit={false} transition={{ enter: { duration: 0.05, ease: 'easeInOut' } }}>
    {children}
  </Fade>
}