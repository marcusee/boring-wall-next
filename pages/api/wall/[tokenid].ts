import { WallPixel } from './../../../store/reducer/wall.reducer';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import WallService from '../../../service/wall-service';

type Data = {
  name: string

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WallPixel>
) {

  const tokenId = req.query.tokenid ?? '0';
  const wall = new WallService();
  const wallPixel = await wall.getPixel(BigInt(tokenId as string));

  res.status(200).json(wallPixel);
}
