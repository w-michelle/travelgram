"use client";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { Oleo_Script } from "next/font/google";
import Link from "next/link";
const oleo_script = Oleo_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oleo-script",
});
function Navtop() {
  return (
    <div className="md:hidden flex items-center px-5 py-4 border-b-2 border-bgrey">
      <Link href="/">
        <h1 className={`${oleo_script.className} text-xl hover:cursor-pointer`}>
          Travelgram
        </h1>
      </Link>

      <div className="flex ml-auto gap-4 text-xl">
        <AiOutlineHeart />
        <FiSend className="send" />
      </div>
    </div>
  );
}

export default Navtop;
