import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFakeChunk, fetchFakePixel, WallPixel, changeStagingColor, setSelected, setSelectedColor } from "../../store/reducer/wall.reducer";
import MenuBar from "../../components/menu-bar";
import { SketchPicker } from 'react-color';
import useContract from "../../hooks/use-contract";
import data from '../../../config/boringwall.json';
import bwallAbi from '../../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { useWeb3Contract, useMoralis} from "react-moralis";
import { BigNumber } from "@ethersproject/bignumber";

export default function PixelDetail() {
  const router = useRouter();
  const {isWeb3Enabled} = useMoralis();

  const dispatch = useAppDispatch();
  const wallPixel = useAppSelector(state => state.wallReducer.selected);
  const stagingColor: string = useAppSelector(state => state.wallReducer.stagingColor);
  const [isOwner, setIsOwner] = useState<number>();
  const [tokenId, setTokenId] = useState<bigint>(0n);
  const [buyMode, setBuyMode] = useState<boolean>(false);
  const contract = useContract();
  const [entraceFee, setEntraceFee] = useState<string>('0');
  const [changeFee, setChangeFee] = useState<string>('0');

  
  const {runContractFunction: getPrice} = useWeb3Contract({
    abi : bwallAbi.abi,
    contractAddress : data.address,
    functionName : "getPrice",
  });

  const {runContractFunction: getChangeFee} = useWeb3Contract({
    abi : bwallAbi.abi,
    contractAddress : data.address,
    functionName : "getChangeFee",
  });


  const {runContractFunction: ownerOf} = useWeb3Contract({
    abi : bwallAbi.abi,
    contractAddress : data.address,
    functionName : "ownerOf",
    params: {
      tokenId : router.query.tokenid?.toString() ?? '0',
    },
  });


  const { runContractFunction: buyPixel } = useWeb3Contract({
    abi : bwallAbi.abi,
    contractAddress : data.address,
    functionName: 'buyPixel',
    msgValue: BigNumber.from(entraceFee).toString(),
    params: {
      tokenId: tokenId,
      color: BigInt(parseInt(stagingColor.slice(1), 16)),
    },
  });

  const { runContractFunction: changePixelColor } = useWeb3Contract({
    abi : bwallAbi.abi,
    contractAddress : data.address,
    functionName: 'changePixelColor',
    msgValue: BigNumber.from(changeFee).toString(),
    params: {
      tokenId: tokenId,
      color: BigInt(parseInt(stagingColor.slice(1), 16)),
    },
  });

  useEffect(() => {
    const id: string = router.query.tokenid?.toString() ?? '0';
    fetchPixel(BigInt(id));

    if (isWeb3Enabled) {
      
      ownerOf({
        onSuccess: (v : any) => {
          console.log(v);
          setIsOwner(v);
        },
        onError: (e) => console.log(e)

      });

      getPrice({
        onSuccess: (v : any) => {
          setEntraceFee(v._hex)
        }
      });

      getChangeFee({
        onSuccess: (v : any) => {
          setChangeFee(v._hex)
        }
      });
    }

  }, []);


  useEffect(() => {
    ownerOf({
      onSuccess: (v : any) => {
        setIsOwner(v);
      }
    });
    getPrice({
      onSuccess: (v : any) => {
        setEntraceFee(v._hex);
      }
    });

  }, [isWeb3Enabled])


  const fetchPixel = async (tokenId: bigint) => {
    const response = await fetch(`../api/wall/${tokenId}`);
    setTokenId(tokenId);

    const pixel = await response.json();
    dispatch(setSelected(pixel));
    dispatch(changeStagingColor(pixel.colorString));

    // const currentUser = Moralis.User.current();

    // if (currentUser != null) {
    //   const owner: boolean = await contract.isOwner(tokenId);
    //   setIsOwner(owner);
    // }
    console.log(pixel);
  }

  const onBuyNFT = async () => {
    console.log(BigNumber.from(entraceFee));
    await buyPixel({
      onSuccess : () => {
        dispatch(setSelectedColor(stagingColor));
      }
    });
    fetchPixel(BigInt(tokenId));
  };

  const onChangeNFTColor = async () => {
    console.log('change pixel');
    await changePixelColor(
      {
        onSuccess : (tx) => {
          dispatch(setSelectedColor(stagingColor));
        }
      }
    );
    // fetchPixel(BigInt(tokenId));
  }

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
      <p>You can change the color.</p>

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
          onChangeNFTColor();
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
          <h3>Token Id : {wallPixel.id}</h3>
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