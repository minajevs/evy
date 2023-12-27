import { prisma, type Collection } from '@evy/db'

export type LayoutServerSideProps = {
  layout: {
    collections: Collection[]
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
      collections,
    },
  }
}
