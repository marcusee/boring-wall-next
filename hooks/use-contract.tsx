import Web3Modal from 'web3modal';
import { ethers, providers } from 'ethers';
import data from '../../config/boringwall.json';
import bwallAbi from '../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setUserAddress } from '../store/reducer/wall.reducer';

export default function useContract() {

  const dispatch = useAppDispatch();

  const getContract = async () => {
    try {
      const web3Modal = new Web3Modal();
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

  const connected = () => window.web3.currentProvider.isMetaMask;


  return { connect, getChunk, connected };
}