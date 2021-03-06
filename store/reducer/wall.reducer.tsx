import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RootState } from '..';
import { RootState } from '../index';
import Web3Modal from 'web3modal';
import {  ethers } from 'ethers';
import data from '../../../config/boringwall.json';
import bwallAbi from '../../../boringwall/artifacts/contracts/BoringWall.sol/BoringWall.json';

const initialState: WallState = {
  value: 2,
  connected: false,
  wallChunks : [],
  headIndex: '0',
  tailIndex: '0',
  hoveredWallPixel : undefined ,
  selected: undefined,
  stagingColor : "#FFFFFF",
  contract : null,
  userAddress: '',
  selectedIndex: null,
  selectedId: null,
}; //Initial state


export interface WallPixel {
  id : string,
  color: number;
  colorString : string;
  xPos: string;
  yPos: string;
  created: number;
}

export interface WallState {
  value: number,
  connected : boolean,
  wallChunks : WallPixel[],
  headIndex : string, // track head chunk index
  tailIndex : string,  // track tail chunk index
  hoveredWallPixel : WallPixel | undefined,
  selected : WallPixel | undefined,
  stagingColor : string,
  contract: any;
  userAddress: string,
  selectedIndex : null | number,
  selectedId : null | string,
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
          id : BigInt(i).toString(),
          color: 0,
          colorString : '#FFFFFF',
          xPos: `${BigInt(i) % 32n}`,
          yPos: `${BigInt(i) / 32n}`,
          created: 0
        }
      )
    }

    return rawBatch;
  }
)

export const fetchFakePixel = createAsyncThunk(
  'wall/fetchFakePixel',
  async (tokenid: bigint) => {
    return   {
      id : tokenid.toString(),
      color: 0,
      colorString : '#FFFFFF',
      xPos: `${tokenid % 32n}`,
      yPos: `${tokenid / 32n}`,
      created: 0
    };
  }
);

const reducerSlice = createSlice({
  name: 'wallReducer',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    hoverOn : (state, action) => {
      state.hoveredWallPixel = action.payload;
    },
    changeStagingColor : (state, action) => {
      state.stagingColor = action.payload;
    },
    setUserAddress : (state, action) => {
      state.userAddress = action.payload;
    },
    appendChunk: (state, action) => {
      state.wallChunks = state.wallChunks.concat(action.payload);
      state.headIndex = (BigInt(state.headIndex) + 1n).toString();
    },
    removeOldChunk: (state) => {
      state.wallChunks.shift();
    },
    setHeadIndex: (state, action) => {
      state.headIndex = action.payload;
    },
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    setOnPressedId : (state, action) => {
      state.selectedId = action.payload;

    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setSelectedColor: (state, action) => {
      if (state.wallChunks && state.selectedIndex && (state.selectedId == state?.selected?.id)) {
        state.wallChunks[state.selectedIndex].colorString = action.payload;
      }
    },
    onBottom: (state) => {

    },
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
      .addCase(fetchFakePixel.fulfilled, (state: WallState, action) => {
        state.headIndex = `${BigInt(state.headIndex) + 1n}`;
        state.selected = action.payload;
        state.stagingColor = action.payload.colorString;
      });
  }
});


export const { increment, setSelectedColor, setOnPressedId, setSelectedIndex, hoverOn, changeStagingColor, setUserAddress, appendChunk, setSelected, setHeadIndex } = reducerSlice.actions
export const selectWallData = (state: RootState) => state.wallReducer;
export default reducerSlice.reducer;