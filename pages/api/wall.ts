import { WallPixel } from './../../store/reducer/wall.reducer';
import type { NextApiRequest, NextApiResponse } from 'next'
import WallService from '../../service/wall-service';
import { CHUNK_HEIGHT } from '../../configs/wall-config';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WallPixel[]>
) {
  const wallService = new WallService();

  const startRaw =  req.query.start ?? '0';
  const limitRaw =  req.query.limit ?? CHUNK_HEIGHT;

  const start : bigint = BigInt(startRaw as string);
  const limit : bigint = BigInt(limitRaw as string);

  const rawChunk = await wallService.getBatched(start, limit);
  const chunk = wallService.refineRawChunk(rawChunk);
  
  res.status(200).json(chunk);
}
