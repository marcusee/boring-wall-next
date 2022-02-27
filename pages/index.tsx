import MenuBar from "../components/menu-bar";

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {increment , getNumber } from '../store/reducer/wall.reducer';


export default function Home() {

  const count = useAppSelector(state => state.wallReducer.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <MenuBar/>
      <div>
        {count}
      </div>

      <button onClick = {() => dispatch(increment())}>
        increase
      </button>

      <br/>

      <button onClick = {() => dispatch(getNumber(2))}>
        increase asyc
      </button>
    </div>
  )
}