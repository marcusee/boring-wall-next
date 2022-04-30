// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import WallService from '../../service/wall-service';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const wallService = new WallService();

  const wallKey = process.env['WALL_KEY'];
  res.status(200).json({ name: `ok` })
}
