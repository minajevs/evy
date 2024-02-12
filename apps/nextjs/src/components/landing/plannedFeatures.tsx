import { Link } from "@chakra-ui/next-js"
import { type CardBodyProps, Container, type ContainerProps, Flex, Icon, Heading, Text, Card, SimpleGrid, Button, useColorModeValue } from "@chakra-ui/react"
import { TagsIcon, type LucideIcon, Share2Icon, FolderUpIcon, Cable, MessageCircleQuestionIcon, Star } from "lucide-react"
import { type ReactNode } from "react"

type Props = {} & ContainerProps
export const PlannedFeatures = ({ ...rest }: Props) => {
  return <Container
    maxWidth='1440'
    px={{ base: 6, md: 12 }}
    {...rest}
  >
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} mt={10} spacing={8}>
      <FeatureCard label='Custom item attributes' icon={TagsIcon}>
        No collection is the same. Use custom attributes and parameters to tracks what matters.
      </FeatureCard>
      <FeatureCard label='Export data' icon={FolderUpIcon}>
        Export your collections if you want a local copy or a backup. Absolutely no data lock-ins.
      </FeatureCard>
      <FeatureCard label='Sharing options' icon={Share2Icon}>
        Not ready to share with the world? Make items or collections private. Choose to share only specific fields or images.
      </FeatureCard>
      <FeatureCard label='API' icon={Cable}>
        Make your collections smart with APIs or webhooks. Integrate Evy with other solutions.
      </FeatureCard>
      <FeatureCard label='Social' icon={Star}>
        Explore other cool collections. Engage with other users and communities.
      </FeatureCard>
      <FeatureCard label='Your idea' icon={MessageCircleQuestionIcon}>
        Have a cool idea for this app in mind? Have some specific feature which you cannot live without?
        <Button m={2} variant='outline' colorScheme='secondary' as={Link} href="mailto:hello@evy.app">Send us a message</Button>
      </FeatureCard>
    </SimpleGrid>
  </Container>
}

type FeatureCardProps = {
  label: string
  icon: LucideIcon
  children: ReactNode
} & CardBodyProps
const FeatureCard = ({ label, icon, children, ...rest }: FeatureCardProps) => {
  const gradFrom = useColorModeValue('pink.300', 'pink.300')
  const gradTo = useColorModeValue('primary.500', 'primary.500')

  return <Card
    p={6}
    mb={6}
    boxShadow='xl'
    borderRadius={{ base: 8, md: 16 }}
    textAlign="center"
    pos="relative"
  >
    <Flex
      p={2}
      w="max-content"
      color="white"
      bgGradient={`linear(to-br, ${gradFrom}, ${gradTo})`}
      rounded="md"
      marginInline="auto"
      pos="absolute"
      left={0}
      right={0}
      top="-1.5rem"
      boxShadow="lg"
    >
      <Icon boxSize={8} as={icon} />
    </Flex>
    <Heading fontWeight="semibold" fontSize="xl" mt={6}>
      {label}
    </Heading>
    <Text fontSize="md" mt={4}>
      {children}
    </Text>
  </Card>
}