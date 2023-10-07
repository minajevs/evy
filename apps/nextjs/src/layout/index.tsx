import Head from "next/head"
import { Box } from "@chakra-ui/react"
import { useBackgroundColor } from "@evy/styling"
import { Sidebar } from "./sidebar"
import { type LinkItem } from "./sidebar/SidebarContent"
import { type LayoutServerSideProps } from "~/utils/layoutServerSideProps"

type Props = {
  children: React.ReactNode
  title?: string
} & LayoutServerSideProps

const Layout = ({ children, layout: { collections }, title }: Props) => {
  const bg = useBackgroundColor('page')
  const linkItems: LinkItem[] = collections.map(collection => ({
    name: collection.name,
    href: `/my/${collection.id}`
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