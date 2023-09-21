import { prisma } from '@evy/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await prisma.$queryRaw`SELECT 1`
  res.status(200).json({ status: 'ok' })
}
