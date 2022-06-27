import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { ConnectButton } from "web3uikit"

export default function MenuBar() {
  return <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between px-2 py-2 bg-teal-500 mb-3">
    <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div className="w-full relative flex justify-between md:w-auto  px-4 md:static md:block md:justify-start">
        <Link href="/">
          <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white hover:opacity-75">
            Home
          </a>
        </Link>
        <button className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none" type="button">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
        </button>
      </div>
      <div className="md:flex md:flex-grow items-center">
        <ul className="flex flex-col md:flex-row list-none ml-auto md:items-center">
          <li className="nav-item">
            <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
              <span className="ml-2">About</span>
            </a>
          </li>
          <ConnectButton moralisAuth={false}/>
        </ul>

      </div>
    </div>
  </nav>
}