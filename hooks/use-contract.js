import Web3Modal from 'web3modal';
import { ethers, providers } from 'ethers';
import data from '../../config/boringwall.json';
import bwallAbi from '../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { useState } from 'react';

export default function useContract() {
  const [contract, setContract] = useState({});

  const connect = async (e) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          data.address,
          bwallAbi.abi,
          signer
        );
  
        setContract(contract);
        return signer;
  
      } catch (e) {
        console.log(e);
        return null;
      }
  };

  return { contract, connect };
}