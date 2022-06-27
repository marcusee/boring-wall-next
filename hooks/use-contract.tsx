import { BigNumber, ethers, providers } from 'ethers';
import data from '../../config/boringwall.json';
import bwallAbi from '../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { useWeb3Contract } from 'react-moralis';

export default function useContract() {

  const contractTemplate = {
    abi: bwallAbi.abi,
    contractAddress: data.address,
  }

  const changePixelColor = async (tokenId: bigint, color: string, onSuccess: (tx: any) => void) => {

    const { runContractFunction: changePixelColor } = useWeb3Contract({
      ...contractTemplate,
      functionName: 'changePixelColor',
      params: {
        tokenId: tokenId,
        color: BigInt(parseInt(color.slice(1), 16)),
      },
    });


    await changePixelColor({
      onSuccess: onSuccess,
      onError: (error) => {
        console.log(error);
      }
    });

  };

  const buyPixel = async (tokenId: bigint, color: string, onSuccess: (tx: any) => void) => {

    const { runContractFunction: buyPixel } = useWeb3Contract({
      ...contractTemplate,
      functionName: 'buyPixel',
      params: {
        tokenId: tokenId,
        color: BigInt(parseInt(color.slice(1), 16)),
      },
    });


    await buyPixel({
      onSuccess: onSuccess,
      onError: (error) => {
        console.log(error);
      }
    });

    const output = await buyPixel();
  }

  const isOwner = async (tokenId: bigint): Promise<boolean> => {
    const { runContractFunction: ownerOf } = useWeb3Contract({
      ...contractTemplate,
      functionName: 'ownerOf',
      params: {
        tokenId: tokenId,
      },
    });


    const output = (await ownerOf());
    let owner : boolean = false;

    try {
      owner = Boolean(output);

    } catch (e) {
      console.log(e);
      return false;
    }

    return owner;
  
  };

  return { isOwner, buyPixel, changePixelColor };
}