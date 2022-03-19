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
}; //Initial state of the counter

interface WallState {
  value: number,
  connected : boolean,
}

// async function connectMetaMask () {
//   const web3Modal = new Web3Modal();
//   const connection = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(connection);
//   const signer = provider.getSigner();

// }


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
  }
});


export const { increment } = reducerSlice.actions
export const selectWallData = (state: RootState) => state.wallReducer;
export default reducerSlice.reducer;