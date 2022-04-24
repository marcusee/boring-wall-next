import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import wallReducer from './reducer/wall.reducer';
import { configureStore, ThunkAction,  Action, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'

// ...

enableMapSet();

const isSerializable = (value: any) => true;

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  // getEntries,
})

export const store = configureStore({
  reducer: {
    wallReducer: wallReducer,
  },
  middleware: [serializableMiddleware],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
