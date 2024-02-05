import { Box, Card, CardBody, CardHeader, Container, type ContainerProps, Heading, SimpleGrid, Text, chakra, type CardBodyProps } from "@chakra-ui/react"
import { type ReactNode } from "react"
import NextImage from "next/image"

import ItemsFilter from '../../../public/images/items-filter.png'
import ItemPhotos from '../../../public/images/item-photos.png'
import ItemSharing from '../../../public/images/item-sharing.png'

const CoolImage = chakra(NextImage, {
  shouldForwardProp: (prop) => ['width', 'height', 'src', 'alt', 'placeholder', 'style', 'onLoad'].includes(prop),
})

type Props = {} & ContainerProps
export const Features = ({ ...rest }: Props) => {
  return <Container maxWidth='1440' px={{ base: 6, md: 12 }} {...rest}>
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      <Box gridColumnStart={{ base: 1 }} gridColumnEnd={{ base: 1, md: 3 }}>
        <FeatureCard label="Powerful search" pb={0} display='flex' flexDirection='column' alignItems='space-between'>
          <Text flex='1'>
            Organize your collection and navigate items quickly by assigning <strong>tags</strong> and <strong>categories</strong><sup>tbd</sup>.
            Filter and search items by <strong>attributes</strong><sup>tbd</sup> and relevant <strong>descriptions</strong>.
          </Text>
          <Box display='flex' justifyContent='center'>
            <CoolImage
              display='flex'
              maxW='750'
              width='100%'
              mt={4}
              src={ItemsFilter}
              alt='items filtering in evy app'
              border='1px solid'
              borderColor='gray.200'
              borderTopRadius={{ base: 8, md: 8 }}
              borderBottomRadius={0}
            />
          </Box>
        </FeatureCard>
      </Box>
      <Box gridColumnStart={{ base: 1, md: 3 }} gridColumnEnd={{ base: 1, md: 4 }}>
        <FeatureCard label="Item photos">
          <Text>
            Have a cool photoshoot of an item, want to create a visual inventory or track appearance and condition details?
            There is a place for it.
          </Text>
          <Box mt={{ base: 4, md: 8 }} mx={-8}>
            <CoolImage
              mt={4}
              mb={-10}
              src={ItemPhotos}
              border='1px solid'
              borderColor='gray.200'
              alt='photos for an item in evy app'
              width='200%'
            />
          </Box>
        </FeatureCard>
      </Box>
      <Box gridColumnStart={{ base: 1 }} gridColumnEnd={{ base: 1 }}>
        <FeatureCard label="Free">
          <Text>
            Evy is free to use, forever.
          </Text>
          <Text mt='1rem'>
            As an avid collectors ourself, we believe hobbyists deserve a simple-to-use, useful solution for free.
            Money is better spent on the hobby, rather than another subscription.
          </Text>
          <Text mt='1rem'>
            Together with lots of more feature, which are coming in the future, some
            paid features might appear. But we won&apos;t take away or limit the free plan.
          </Text>
        </FeatureCard>
      </Box>
      <Box gridColumnStart={{ base: 1, md: 2 }} gridColumnEnd={{ base: 1, md: 4 }}>
        <FeatureCard label="Share your items" pb={0} display='flex' flexDirection='column' alignItems='space-between'>
          <Text>
            Hobbies are better enjoyed together. Share your collection with friends and family or engage with other collectors<sup>tbd</sup>.
          </Text>
          <Box display='flex' justifyContent='center'>
            <CoolImage
              display='flex'
              maxW='750'
              width='100%'
              mt={4}
              src={ItemSharing}
              alt='items sharing in evy app'
              border='1px solid'
              borderColor='gray.200'
              borderTopRadius={{ base: 8, md: 8 }}
              borderBottomRadius={0}
            />
          </Box>
        </FeatureCard>
      </Box>
    </SimpleGrid>
  </Container>
}

type FeatureCardProps = {
  label: string
  children: ReactNode
} & CardBodyProps
const FeatureCard = ({ label, children, ...rest }: FeatureCardProps) => {
  return <Card boxShadow='xl' height='100%' borderRadius={{ base: 8, md: 16 }}>
    <CardHeader px={{ base: 4, md: 8 }} pt={{ base: 4, md: 8 }} pb={4}>
      <Heading size='md'>{label}</Heading>
    </CardHeader>
    <CardBody px={{ base: 4, md: 8 }} pt={0} pb={{ base: 4, md: 8 }} overflow='hidden' {...rest}>
      {children}
    </CardBody>
  </Card>
}