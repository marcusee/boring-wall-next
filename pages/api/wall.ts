import { WallPixel } from './../../store/reducer/wall.reducer';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import WallService from '../../service/wall-service';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WallPixel[]>
) {
  const wallService = new WallService();

  const startRaw =  req.query.start ?? '0';
  const limitRaw =  req.query.start ?? '1024';

  console.log(startRaw);
  console.log(limitRaw);

  const start : bigint = BigInt(startRaw as string);
  const limit : bigint = BigInt(limitRaw as string);

  const rawChunk = await wallService.getBatched(start, limit);
  const chunk = wallService.refineRawChunk(rawChunk);
  
  res.status(200).json(chunk);
}
