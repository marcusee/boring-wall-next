import Web3Modal from 'web3modal';
import { BigNumber, ethers, providers } from 'ethers';
import data from '../../config/boringwall.json';
import bwallAbi from '../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setUserAddress } from '../store/reducer/wall.reducer';

export default function useContract() {

  const dispatch = useAppDispatch();

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

  const getChunk = async (start : bigint, limit : bigint) => {
    const contract = await getContract();
    const rawChunk = await contract.getBatched(start, limit);
    return rawChunk;
  }

  const buyPixel = async (tokenId : bigint) => {
    const contract = await getContract();
    const rawPrice : BigNumber = await contract.getPrice();
    let price = ethers.utils.formatUnits(rawPrice.toString(), 'ether')
    const transaction = await contract?.buyPixel(tokenId, 0, {value : rawPrice});
    await transaction.wait();
    console.log('done');
  }

  const refinedChunk = async (rawChunk : []) => {

    const chunk = [];

    for (let rawPixel of rawChunk) {
      chunk.push(
        {
          id : 1
        }
      );
    }

    return chunk;

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

  return { connect, getChunk, connected, isOwner, buyPixel };
}