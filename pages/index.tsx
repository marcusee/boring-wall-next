import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MenuBar from "../components/menu-bar";
import Wall from "../components/wall-component";

export default function Home() {
  return (
    <div className="bg-slate-100" >
      <MenuBar />
      <Wall />
    </div>
  )
}
