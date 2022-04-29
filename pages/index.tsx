import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MenuBar from "../components/menu-bar";
import Wall from "../components/wall-component";

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { increment, getNumber } from '../store/reducer/wall.reducer';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [overBottom, setOverBottom] = useState(false);
  const [loading, setLoading] = useState(0); // Controls to prevent 2x load

  return (
    <div className="bg-slate-100" >
      <MenuBar />
      <Wall />
    </div>
  )
}
