import { Box, type BoxProps, Container } from "@chakra-ui/react"
import { Image } from "@chakra-ui/next-js"
import NextImage from "next/image"
import EvyDemoImage from '../../../public/images/evy.png'

type Props = {} & BoxProps
export const ImageSection = ({ ...rest }: Props) => {
  return <Box width='100%' {...rest}>
    <Container maxW='1440' px={{ base: 4, md: 8 }} py={6} mx="auto">
      <Box px={{ base: 4, md: 8 }}>
        <Image
          as={NextImage}
          src={EvyDemoImage}
          placeholder='blur'
          alt={'evy demo screenshot'}
          style={{ objectFit: 'cover' }}
          borderRadius={{ base: 8, md: 16 }}
          border='1px solid'
          borderColor='gray.200'
          boxShadow='2xl'
          sizes="(max-width: 480px) 90vw, (max-width: 768px) 88vw, (max-width: 991px) 85vw, 70vw"
        />
      </Box>
    </Container>
  </Box>
}