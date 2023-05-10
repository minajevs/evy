import type { GetServerSidePropsContext, NextPage } from "next"
import { clerkClient, getAuth, buildClerkProps } from "@clerk/nextjs/server"
import Layout from "~/layout"

const Home: NextPage = () => {
  // const deletePostMutation = api.post.delete.useMutation({
  //   onSettled: () => postQuery.refetch(),
  // });

  return (
    <Layout>
      Hello!
    </Layout>
  );
}

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const auth = await getAuth(req)

  if (!auth.userId) {
    return {}
  }

  return { redirect: { permanent: false, destination: "/my" } }
}

export default Home