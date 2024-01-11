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

export const MyLayout = ({ children, layout, title }: Props) => {
  const bg = useBackgroundColor('page')

  let authContent = <></>
  if (layout.loggedIn) {
    const linkItems: LinkItem[] = layout.collections.map(collection => ({
      name: collection.name,
      href: `/my/${collection.slug}`
    }))
    authContent = <>
      <Sidebar
        display={{ base: 'none', md: 'block' }}
        linkItems={linkItems}
      />
      <MobileNav display={{ base: 'flex', md: 'none' }} />
    </>
  }
  return <>
    <Head>
      <title>{`Evy ${title !== undefined ? `| ${title}` : ''}`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.svg" />
    </Head>
    <Box minH="100vh" bg={bg}>
      {authContent}
      <Box ml={{ base: 0, md: 60 }} p={{ base: 4, sm: 8 }}>
        {children}
      </Box>
      <BottomNavigation display={{ base: 'flex', md: 'none' }} />
    </Box>
  </>
}

export default MyLayout