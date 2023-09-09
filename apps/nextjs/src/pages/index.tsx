import { getServerSession } from "@evy/auth";
import type { GetServerSidePropsContext, NextPage } from "next"
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

export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
  const auth = await getServerSession({ req, res })

  if (!auth) {
    return { props: {} }
  }

  return { redirect: { permanent: false, destination: "/my" } }
}

export default Home