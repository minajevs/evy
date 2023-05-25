import type { GetServerSidePropsContext, NextPage } from "next"
import { getAuth } from "@clerk/nextjs/server"
import Layout from "~/layout"

const Home: NextPage = () => {
  // const deletePostMutation = api.post.delete.useMutation({
  //   onSettled: () => postQuery.refetch(),
  // });

  return (
    <Layout collections={[]}>
      Hello!
    </Layout>
  );
}

export function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const auth = getAuth(req)

  if (!auth.userId) {
    return {}
  }

  return { redirect: { permanent: false, destination: "/app/my" } }
}

export default Home