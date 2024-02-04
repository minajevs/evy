import { Box, type BoxProps, Container, SlideFade, useDisclosure, chakra } from "@chakra-ui/react"
import NextImage from "next/image"
import EvyDemoImage from '../../../public/images/evy.png'

const CoolImage = chakra(NextImage, {
  shouldForwardProp: (prop) => ['width', 'height', 'src', 'alt', 'placeholder', 'style', 'onLoad'].includes(prop),
})


type Props = {} & BoxProps
export const ImageSection = ({ ...rest }: Props) => {
  const { isOpen, onOpen } = useDisclosure()

  return <Box width='100%' {...rest}>
    <Container maxW='container.lg' px={{ base: 4, md: 8 }} py={6} mx="auto">
      <Box px={4}>
        <SlideFade in={isOpen} unmountOnExit={false} transition={{ enter: { delay: 0.2 } }}>
          <CoolImage
            src={EvyDemoImage}
            placeholder='blur'
            alt={'evy demo screenshot'}
            style={{ objectFit: 'cover' }}
            borderRadius={{ base: 8, md: 16 }}
            border='1px solid'
            borderColor='gray.200'
            boxShadow='2xl'
            sizes="(max-width: 480px) 90vw, (max-width: 768px) 88vw, (max-width: 991px) 85vw, 70vw"
            transition='0.3s'
            onLoad={onOpen}
          />
        </SlideFade>
      </Box>
    </Container>
  </Box>
}