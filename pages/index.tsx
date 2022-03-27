import { useEffect, useRef, useState } from "react";
import MenuBar from "../components/menu-bar";
import Wall from "../components/wall-component";

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { increment, getNumber } from '../store/reducer/wall.reducer';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [overBottom, setOverBottom] = useState(false);
  const [loading, setLoading] = useState(0); // Controls to prevent 2x load


  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (overBottom && (window.innerHeight + window.scrollY) < document.body.offsetHeight) {
        setOverBottom(false);
        console.log(overBottom);
      } else if (!overBottom  && Math.floor(window.innerHeight + window.scrollY) == Math.floor(document.body.offsetHeight)) {
        console.log('bottom');
        setOverBottom(true);
      }

      if (window.scrollY === 0) {
        //  we at top
        console.log('top');
      }

    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  return (
    <div className="bg-slate-100" >
      <MenuBar />
      <Wall />
    </div>
  )
}
