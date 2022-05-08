import Web3Modal from 'web3modal';
import {  ethers } from 'ethers';
import Web3 from 'web3';
import data from '../../config/boringwall.json';
import bwallAbi from '../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';
import { AbiItem } from 'web3-utils'
import { WallPixel } from '../store/reducer/wall.reducer';

export default class WallService {

    WallService() {
        
    }

    async getContract ()  {
      const abi =  bwallAbi.abi as unknown as AbiItem[];

      const web3 = new Web3('http://127.0.0.1:8545');
      const networkId = await web3.eth.net.getId();
      const myContract : any = new web3.eth.Contract(
        abi,
        data.address,
      );

      return myContract;
    }

    async getBatched(start : bigint, limit : bigint) {
      const contract =  await this.getContract();
      const rawChunk = await contract.methods.getBatched(start, limit).call();
      return rawChunk;
    }

    refineRawChunk (rawChunk : []) : Array<WallPixel> {
      const chunk = Array<WallPixel>();

      for(let rawPixel of rawChunk) {
        const wallPixel : WallPixel = this.refineRawPixel(rawPixel);
        chunk.push(wallPixel);
      }

      return chunk;
    }

    refineRawPixel(rawPixel: Array<any>) : WallPixel {
      const tokenId = BigInt(rawPixel[0]);

      return {
        id : tokenId.toString(),
        color: rawPixel[1],
        colorString : '#' +
          parseInt(rawPixel[1])
            .toString(16)
            .padStart(6, '0')
            .toUpperCase(),
        xPos: `${BigInt(tokenId) % 32n}`,
        yPos: `${BigInt(tokenId) / 32n}`,
        created: rawPixel[2]
      } as WallPixel;
    }

    async getPixel(tokenId : bigint) : Promise<WallPixel> {
      const contract =  await this.getContract();
      const rawPixel = await contract.methods.getPixel(tokenId).call();
      // console.log(contract.methods);
      console.log('raw pixel', rawPixel, rawPixel.tokenId);
      return this.refineRawPixel(rawPixel);
    }
}