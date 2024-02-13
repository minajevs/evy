import { prisma, type Collection } from '@evy/db'
import { type NextApiRequestCookies } from 'next/dist/server/api-utils'
import { feedbackSeenCookieName } from '~/components/feedback/FeedbackWidget'

export type LayoutServerSideProps = {
  layout:
    | {
        loggedIn: true
        collections: Collection[]
        seenFeedback: boolean
      }
    | {
        loggedIn: false
      }
}

export const getLayoutProps = async (
  userId: string,
  cookies: NextApiRequestCookies,
): Promise<LayoutServerSideProps> => {
  const feedbackCookie = cookies[feedbackSeenCookieName]

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
      seenFeedback: feedbackCookie !== undefined,
    },
  }
}
