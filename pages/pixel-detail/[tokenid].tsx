import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFakeChunk, fetchFakePixel, WallPixel } from "../../store/reducer/wall.reducer";
import MenuBar from "../../components/menu-bar";

export default function PixelDetail() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { tokenId } = router.query;
  const wallPixel = useAppSelector(state => state.wallReducer.selected);
  const chunk = useAppSelector(state => state.wallReducer.wallChunks);

  useEffect(() => {
    const id: string = router.query.tokenid?.toString() ?? '0';
    console.log(id);
    dispatch(fetchFakePixel(BigInt(id)));

    console.log(chunk);

  }, []);

  const isOwned = () => {
    return wallPixel?.created != 0;
  }

  let buyDetails;

  if (isOwned()) {
    buyDetails = <div>
      <p className="break-normal">This NFT is already owned. To buy it view it on Open Sea.</p>
      <a>Open sea link place holder</a>
    </div>
  } else {
    buyDetails = <div className="flex flex-col space-y-2">
      <p>This NFT is not owned! Be the first!</p>
      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {

        }}>Buy</button>
    </div>
  }

  if (wallPixel == undefined) {
    return <div>
      <MenuBar />
      <h2>Loading ....</h2>
    </div>
  }

  return (
    <div className="bg-slate-100">
      <MenuBar />
      <div className="flex py-32 items-center place-content-center justify-evenly w-full flex-col md:flex-row space-y-8">
        <div className="flex space-y-2 flex-col">
          <h3>Token Id : </h3>
          <div
            className="w-32 h-32 shadow-2xl"
            style={{
              backgroundColor: wallPixel.colorString
            }}

          ></div>

          <li>
            X: {wallPixel?.xPos}
          </li>

          <li>
            Y: {wallPixel?.yPos}
          </li>

          <li>
            color: {wallPixel?.colorString}
          </li>

        </div>

        {/* <!-- buy details --> */}
        <div>
          <div className="flex flex-col">
            {buyDetails}
          </div>
        </div>
      </div>
    </div>
  );
}