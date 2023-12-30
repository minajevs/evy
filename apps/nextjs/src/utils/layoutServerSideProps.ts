import { prisma, type Collection } from '@evy/db'

export type LayoutServerSideProps = {
  layout:
    | {
        loggedIn: true
        collections: Collection[]
      }
    | {
        loggedIn: false
      }
}

export const getLayoutProps = async (
  userId: string,
): Promise<LayoutServerSideProps> => {
  const collections = await prisma.collection.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    layout: {
      loggedIn: true,
      collections,
    },
  }
}
