import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { RootState } from '..';
import { RootState } from '../index';

const initialState: WallState = {
  value: 2,
}; //Initial state of the counter

interface WallState {
  value: number
}

export const getNumber = createAsyncThunk(
  'wall/getNumber',
  async (amount: number) => {
    const response = await Promise.resolve(amount);

    return response;
  }

)

const reducerSlice = createSlice({
  name: 'wallReducer',
  initialState,
  reducers: {
    increment: state => {
      console.log("hello");
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
  }
});


export const { increment } = reducerSlice.actions
export const selectWallData = (state: RootState) => state.wallReducer;
export default reducerSlice.reducer;