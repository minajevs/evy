import Head from "next/head"
import { Nav } from "./Nav"
import { Box } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { Sidebar } from "./sidebar"
import type { Collection } from "@evy/db"
import { type LinkItem } from "./sidebar/SidebarContent"

type Props = {
  children: React.ReactNode
  collections: Collection[]
  title?: string
}

const Layout = ({ children, collections, title }: Props) => {
  const bg = useBackgroundColor('page')
  const linkItems: LinkItem[] = collections.map(collection => ({
    name: collection.name,
    href: collection.id
  }))
  return <>
    <Head>
      <title>{`📚 Evy ${title !== undefined ? `| ${title}` : ''}`}</title>
      <meta name="description" content="Amazing Evy app!" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box minH="100vh" bg={bg}>
      <Sidebar linkItems={linkItems} />
      <Box ml={{ base: 0, md: 60 }} p="8">
        {children}
      </Box>
    </Box>
  </>
}

export default Layout