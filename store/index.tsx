import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import wallReducer from './reducer/wall.reducer';
import { configureStore, ThunkAction,  Action } from '@reduxjs/toolkit'
// ...

export const store = configureStore({
  reducer: {
    wallReducer: wallReducer,
  }
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
