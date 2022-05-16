import { useRouter } from "next/router";
import { Props } from "next/script";
import { useEffect, useState } from "react"
import useContract from "../hooks/use-contract";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { WallPixel, fetchFakeChunk, hoverOn, appendChunk } from "../store/reducer/wall.reducer";



export default function Wall() {
  const wallChunks = useAppSelector(state => state.wallReducer.wallChunks);
  const headIndex = useAppSelector(state => state.wallReducer.headIndex);

  const dispatch = useAppDispatch();
  // const contract = useAppSelector(state => state.wallReducer.contract);
  const { connect, getChunk, connected } = useContract();

  useEffect(() => {
    loadChunk();

  }, []);

  const [scrollY, setScrollY] = useState(0);
  const [overBottom, setOverBottom] = useState(false);
  const [loading, setLoading] = useState(false); // Controls to prevent 2x load

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (overBottom && (window.innerHeight + window.scrollY) < document.body.offsetHeight) {
        setOverBottom(false);
        console.log(overBottom);
      } else if (!overBottom && Math.floor(window.innerHeight + window.scrollY) == Math.floor(document.body.offsetHeight)) {
        console.log('bottom');
        setOverBottom(true);
        onBottom();
      }

      if (window.scrollY === 0) {
        //  we at top
        console.log('top');
      }

    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  async function onBottom() {
    if (loading) {
      return;
    }
    await loadChunk();
  }


  async function loadChunk() {
    if (connected()) {
      console.log('entered here');
      // const chunk = await getChunk(BigInt(0), BigInt(2048));
      // console.log(chunk);
    }
    setLoading(true);
    const start = BigInt(headIndex) * 2048n;
    console.log('start' , start);
    const response = await fetch(`./api/wall?limit=2048&start=${start.toString()}`);
    const data = await response.json();
    dispatch(appendChunk(data));
    setLoading(false);
  }

  if (wallChunks.length === 0)
    return <h2>Loading...</h2>

  return (
    <div>
      <div className="flex mt-12 items-center w-full flex-col items-center">
        <div className="relative">
          <div className="hidden md:block sticky top-16 float-right mx-12 ">
            <WallCoordinateHelper />
          </div>
          <div className="hidden md:block sticky top-16 float-left mx-12">
            <WallCoordinateIndicator />
          </div>
          <div className="grid content-center grid-cols-32 gap-0 shadow-xl">
            {wallChunks.map((chunk: Array<WallPixel>, key: any) => (
              <WallChunk key={key} chunk={chunk} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WallChunk({ chunk }: { chunk: Array<WallPixel> }) {
  useEffect(() => {

  }, []);

  return (
    <>
      {
        chunk?.map((value: WallPixel, key: any) => {
          return <WallPixelUI key={key} pixel={value} />
        })
      }
    </>
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

  useEffect(() => {
  }, []);

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