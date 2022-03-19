import MenuBar from "../components/menu-bar";
import Wall from "../components/wall-component";

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {increment , getNumber } from '../store/reducer/wall.reducer';

export default function Home() {

  const count = useAppSelector(state => state.wallReducer.value);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-slate-100">
      <MenuBar/>
      <Wall/>
    </div>
  )
}