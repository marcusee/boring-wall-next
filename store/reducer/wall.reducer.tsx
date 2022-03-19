import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RootState } from '..';
import { RootState } from '../index';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import data from '../../../config/boringwall.json';
import bwallAbi from '../../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';



const initialState: WallState = {
  value: 2,
  connected: false,
  wallChunks : new Map(),
  headIndex: 0n,
  tailIndex: 0n
}; //Initial state of the counter


export interface WallPixel {
  id : bigint,
  color: number;
  colorString : string;
  xPos: bigint;
  yPos: bigint;
  created: number;

}

export interface WallState {
  value: number,
  connected : boolean,
  wallChunks : Map<bigint, Array<WallPixel>>,
  headIndex : 0n, // track head chunk index
  tailIndex : 0n  // track tail chunk index
}

export const getNumber = createAsyncThunk(
  'wall/getNumber',
  async (amount: number) => {
    const response = await Promise.resolve(amount);

    return response;
  }

)

export const connectMetaMask = createAsyncThunk(
  'wall/connect',
  async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract : any = new ethers.Contract(
      data.address,
      bwallAbi.abi,
      signer
    );

    return contract;
  }
)

export const fetchChunk = createAsyncThunk(
  'wall/fetchChunk',
  async (chunkId: bigint) => {
    const response = await Promise.resolve(chunkId);

    return response;
  }
)

export const fetchFakeChunk = createAsyncThunk(
  'wall/fetchChunk',
  async (chunkId: bigint) => {
    const response = await Promise.resolve(chunkId);
    const rawBatch = Array<WallPixel>();

    for (let i = 0; i < 2048; i++ ) {
      rawBatch.push(
        {
          id : BigInt(i),
          color: 0,
          colorString : '#FFFFFF',
          xPos: 0n,
          yPos: 0n,
          created: 0
        }
      )
    }

    return rawBatch;
  }
)

function refineRawBatch () {

}

const reducerSlice = createSlice({
  name: 'wallReducer',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNumber.pending, (state) => {
        console.log("OK");
      })
      .addCase(getNumber.fulfilled, (state : WallState, action) => {
        state.value += action.payload
      })
      .addCase(connectMetaMask.fulfilled, (state : WallState, action) => {
        console.log(action);
      })
      .addCase(fetchFakeChunk.fulfilled, (state: WallState, action) => {
        state.wallChunks.set(state.headIndex, action.payload);
      });
  }
});


export const { increment } = reducerSlice.actions
export const selectWallData = (state: RootState) => state.wallReducer;
export default reducerSlice.reducer;