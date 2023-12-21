import Head from "next/head"
import { Box } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { Sidebar, type LinkItem } from "./navigation/Sidebar"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"
import { BottomNavigation } from "./navigation/BottomNavigation"
import { MobileNav } from "./navigation/MobileNav"

type Props = {
  children: React.ReactNode
  title?: string
} & LayoutServerSideProps

const Layout = ({ children, layout: { collections }, title }: Props) => {
  const bg = useBackgroundColor('page')
  const linkItems: LinkItem[] = collections.map(collection => ({
    name: collection.name,
    href: `/my/${collection.slug}`
  }))
  return <>
    <Head>
      <title>{`📚 Evy ${title !== undefined ? `| ${title}` : ''}`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box minH="100vh" bg={bg}>
      <Sidebar
        display={{ base: 'none', md: 'block' }}
        linkItems={linkItems}
      />
      <MobileNav display={{ base: 'flex', md: 'none' }} />
      <Box ml={{ base: 0, md: 60 }} p="8">
        {children}
      </Box>
      <BottomNavigation display={{ base: 'flex', md: 'none' }} />
    </Box>
  </>
}

export default Layout