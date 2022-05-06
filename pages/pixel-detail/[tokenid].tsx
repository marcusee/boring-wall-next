import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFakeChunk, fetchFakePixel, WallPixel, changeStagingColor, setSelected } from "../../store/reducer/wall.reducer";
import MenuBar from "../../components/menu-bar";
import { SketchPicker } from 'react-color';
import useContract from "../../hooks/use-contract";

export default function PixelDetail() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const wallPixel = useAppSelector(state => state.wallReducer.selected);
  const stagingColor: string = useAppSelector(state => state.wallReducer.stagingColor);
  const [isOwner, setIsOwner] = useState<boolean>();
  const [tokenId, setTokenId] = useState<bigint>(0n);
  const [buyMode, setBuyMode] = useState<boolean>(false);
  const contract = useContract();

  useEffect(() => {
    const id: string = router.query.tokenid?.toString() ?? '0';
    fetchPixel(BigInt(id));
  }, []);


  const fetchPixel = async (tokenId: bigint) => {
    const response = await fetch(`../api/wall/${tokenId}`);
    setTokenId(tokenId);

    const pixel = await response.json();
    dispatch(setSelected(pixel));

    if (contract.connected()) {
      const owner: boolean = await contract.isOwner(tokenId);
      setIsOwner(owner);
    }
    console.log(pixel);
  }

  const onBuyNFT = async () => {
    await contract.buyPixel(
      tokenId,
      stagingColor
    );
    fetchPixel(BigInt(tokenId));
  };

  const isOwned = () => {
    return wallPixel?.created != 0;
  }

  let buyDetails;

  let buyModeDiv = <div>
    <p>Change NFT color before you buy!</p>
    <SketchPicker
      color={stagingColor ?? '#FFFFFF'}
      onChangeComplete={(color) => {
        if (wallPixel) {
          dispatch(changeStagingColor(color.hex));
        }
      }}
      disableAlpha={true}
    />
  </div>

  if (isOwner) {
    buyDetails = <div>
      <p>You are the owner of this NFT!</p>
      <p>You can change the color</p>

      <SketchPicker
        color={stagingColor ?? '#FFFFFF'}
        onChangeComplete={(color) => {
          if (wallPixel) {
            dispatch(changeStagingColor(color.hex));
          }
        }}
        disableAlpha={true}
      />

      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded my-4 mx-2"
        onClick={() => {

        }}>Save</button>

      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded my-4 mx-2"
        onClick={() => {
          dispatch(changeStagingColor(wallPixel?.colorString));
        }}>Reset</button>

    </div>
  } else if (isOwned()) {
    buyDetails = <div>
      <p className="break-normal">This NFT is already owned. To buy it view it on Open Sea.</p>
      <a>Open sea link place holder</a>
    </div>
  } else {
    buyDetails = <div className="flex flex-col space-y-2">
      <p>This NFT is not owned! Be the first!</p>
      {
        buyMode && buyModeDiv
      }
      <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          if (buyMode) {
            onBuyNFT();
          } else {
            setBuyMode(true);
          }
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
            className="w-32 h-32 shadow-2xl "
            style={{
              backgroundColor: stagingColor
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