import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { GridLoader } from "react-spinners";
import { CHUNK_HEIGHT } from "../configs/wall-config";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { WallPixel, hoverOn, appendChunk } from "../store/reducer/wall.reducer";

export default function Wall() {
  const wallChunks = useAppSelector(state => state.wallReducer.wallChunks);
  const tailIndex = useAppSelector(state => state.wallReducer.tailIndex);
  const dispatch = useAppDispatch();
  const [overBottom, setOverBottom] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Controls to prevent 2x load
  const [headIndex, setHeadIndex] = useState<bigint>(0n);

  const handleScroll = () => {
    if (overBottom && (window.innerHeight + window.scrollY) < document.body.offsetHeight) {
      setOverBottom(false);
    } else if (!overBottom && Math.floor(window.innerHeight + window.scrollY) == Math.floor(document.body.offsetHeight) && !loading) {
      setLoading(true);
      setOverBottom(true);
      onBottom();
    }

    if (window.scrollY === 0) {
      //  we at top
      console.log('top');
    }

  };

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  });

  useEffect(() => {
    const list : any = document.getElementById('list');
    if (list == null) return;
    if(list.clientHeight <= window.innerHeight && list.clientHeight) {
      if (loading) {
        return;
      }
      loadChunk();
    } 
  },[wallChunks]);

  async function onBottom() {

    const list : any = document.getElementById('list');
    if((list?.clientHeight ?? 0) <= window.innerHeight && list.clientHeight) {
      return;
    }

    if (loading) {
      return;
    }
    await loadChunk();
  }

  async function loadChunk() {
    const start = BigInt(headIndex) * CHUNK_HEIGHT;
    const newIndex = headIndex + 1n;
    setHeadIndex(newIndex);
    const url = `./api/wall?limit=${CHUNK_HEIGHT}&start=${start.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    await setLoading(false);
    dispatch(appendChunk(data));
  }

  if (wallChunks.length === 0)
    return <div id="list" className="flex my-12 flex-col items-center">
        <GridLoader />
    </div>

  return (
    <div>
      <div id="list" className="flex mt-12 items-center w-full flex-col items-center">
        {tailIndex != '0' && <GridLoader />}
        <div className="relative">
          <div className="hidden md:block sticky top-16 float-right mx-12 ">
            <WallCoordinateHelper />
          </div>
          <div className="hidden md:block sticky top-16 float-left mx-12">
            <WallCoordinateIndicator />
          </div>
          <div className="grid content-center grid-cols-32 gap-0 shadow-xl">
            {
              wallChunks?.map((value: WallPixel, key: any) => {
                return <WallPixelUI key={key} pixel={value} />
              })
            }
          </div>
        </div>
        <div className="py-2"></div>
        <GridLoader />
      </div>
    </div>
  )
}


export function WallPixelUI({ pixel }: { pixel: WallPixel }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return <div
    data-x={pixel.yPos}
    onMouseEnter={() => dispatch(hoverOn(pixel))}
    onClick={() => router.push(`/pixel-detail/${pixel.id}`)}
    className="w-4 h-4 hover:border-black hover:border-2"
    style={{ backgroundColor: pixel.colorString }}>
  </div>
}

export function WallCoordinateHelper() {
  const hoveredWallPixel = useAppSelector(state => state.wallReducer.hoveredWallPixel);

  const getX = () => {
    return hoveredWallPixel?.xPos ?? '';
  }

  const getY = () => {
    return hoveredWallPixel?.yPos ?? '';
  }

  return (
    <div className="flex flex-col">
      <div>
        <h4>Coordinate</h4>
      </div>
      <div > X : {getX()}</div>
      <div > Y : {getY()}</div>
    </div>
  );
}

export function WallCoordinateIndicator() {

  const [x, setX] = useState('0');

  function updateCoordinate() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const coordElem: HTMLElement | null = document.elementFromPoint(vw / 2, 80) as HTMLElement;
    const middleX = coordElem?.dataset.x;
    setX(middleX ?? '0');
  }

  useEffect(() => {
    window.addEventListener('scroll', updateCoordinate, false);
  }, []);

  return <div>
    {x} ➡️
  </div>
}