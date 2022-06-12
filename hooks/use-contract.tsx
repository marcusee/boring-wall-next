import Web3Modal from 'web3modal';
import { BigNumber, ethers, providers } from 'ethers';
import data from '../../config/boringwall.json';
import bwallAbi from '../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setUserAddress } from '../store/reducer/wall.reducer';
import { useWeb3Contract } from 'react-moralis';

export default function useContract() {

  const dispatch = useAppDispatch();

  const contractTemplate = {
    abi: bwallAbi.abi,
    contractAddress:   data.address,
  }

  const getContract = async () => {
    try {
      const web3Modal = new Web3Modal({
        network : 'localhost'
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = signer.getAddress();
      const contract : any =  new ethers.Contract(
        data.address,
        bwallAbi.abi,
        signer
      );

      dispatch(setUserAddress(address));

      return contract;

    } catch (e) {
      console.log(e);
      return null;
    }
  }


  const connect = async () => {
    return await getContract();
  };

  const changePixelColor = async (tokenId: bigint, color : string, onSuccess: (tx : any) => void,  ) => {

    const { runContractFunction: changePixelColor } = useWeb3Contract({
        ...contractTemplate,
        functionName : 'changePixelColor',
        params : {
          tokenId : tokenId,
          color : BigInt(parseInt(color.slice(1), 16)),
        },
    });


    await changePixelColor({
      onSuccess: onSuccess,
      onError : (error) => {
        console.log(error);
      };
    });

  };

  const buyPixel = async (tokenId : bigint, color : string) => {
    const contract = await getContract();
    const rawPrice : BigNumber = await contract.getPrice();
    // let price = ethers.utils.formatUnits(rawPrice.toString(), 'ether')
    const transaction = await contract?.buyPixel(
      tokenId, 
      BigInt(parseInt(color.slice(1), 16)), 
      {value : rawPrice}
    );
    const output = await transaction.wait();
  }

  const isOwner = async (tokenId : bigint) : Promise<boolean> => {
    const contract =  await getContract();
    const rawPixel = await contract.getPixel(tokenId);

    console.log(rawPixel[2].gt(0));
    if (rawPixel[2].gt(0)) {
      return await contract?.ownerOf(tokenId) ?? false;
    }

    return false;
  };

  const connected = () => window.web3.currentProvider.isMetaMask;

  return { connect, connected, isOwner, buyPixel, changePixelColor };
}