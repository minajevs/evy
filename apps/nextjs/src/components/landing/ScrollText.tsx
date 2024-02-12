import { Box, type BoxProps, useInterval } from "@chakra-ui/react"
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion"
import { useState, type ReactNode } from "react"

type Props = {
  children: ReactNode[]
} & BoxProps
export const ScrollText = ({ children, ...rest }: Props) => {
  const [currentChild, setChild] = useState(0)

  const nextChild = () => setChild(prev => prev + 1)

  useInterval(nextChild, 3000)

  return <Box {...rest}>
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode='popLayout'>
        <m.div
          key={currentChild}
          initial={{ opacity: 0, scale: 0.9, y: '10px' }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: '-10px' }}
          layout='position'
          transition={{
            duration: 0.25,
            ease: 'easeInOut'
          }}
          onClick={nextChild}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {children[currentChild % (children.length - 1)]}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  </Box>
}