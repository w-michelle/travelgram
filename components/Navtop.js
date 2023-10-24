"use client";

import { Lobster } from "next/font/google";
import Link from "next/link";
const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
});
function Navtop() {
  return (
    <div className="md:hidden flex items-center px-2 py-4 border-b-2 border-bgrey">
      <Link href="/">
        <h1
          className={`${lobster.className} text-xl hover:cursor-pointer`}
          aria-label="Logo"
        >
          Travelgram
        </h1>
      </Link>
    </div>
  );
}

export default Navtop;
