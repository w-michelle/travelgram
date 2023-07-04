"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { RiAddBoxLine } from "react-icons/ri";

import { FiSend } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { RiVideoLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import Upload from "./Upload";
import { Oleo_Script } from "next/font/google";
import Image from "next/image";
const oleo_script = Oleo_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oleo-script",
});
function Nav() {
  const [user, loading] = useAuthState(auth);
  const [toggleUpload, setToggleUpload] = useState(false);
  const router = useRouter();
  let DEFAULT_PROFILE_IMAGE =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  const handleToggle = (boo) => {
    setToggleUpload(!boo);
  };

  const handleLogOut = () => {
    auth.signOut();
    router.push("/");
  };

  return (
    <>
      {user && (
        <nav>
          <div className="md:hidden fixed bottom-0 w-full bg-white">
            <ul className="flex justify-between items-center w-full px-10 py-3 text-2xl">
              <Link href="/">
                <AiOutlineHome className="text-blue" />
              </Link>

              {/* <Link href="#">
                <BiSearch className="icon" />
              </Link> */}

              <Link href="#">
                <RiAddBoxLine
                  className="icon"
                  onClick={() => setToggleUpload(true)}
                />
              </Link>

              {/* <Link href="#">
                <RiVideoLine className="icon" />
              </Link> */}

              <Link href="/profile">
                {user && (
                  <Image
                    src={user ? user.photoURL : ""}
                    alt="Profile Picture"
                    className="w-8 rounded-full "
                  />
                )}
              </Link>
            </ul>
          </div>
          <div className="lg:w-1/6 md:block hidden fixed top-0 h-screen w-1/8 p-4 border-r-2 border-bgrey">
            <ul className="nav-list-v flex flex-col gap-8 mt-6">
              <Link href="/">
                <h1
                  className={`lg:block lg:text-2xl hidden ${oleo_script.className} text-xl`}
                >
                  Travelgram
                </h1>
              </Link>

              <Link href="/">
                <div className="nav-list-v-item">
                  <AiOutlineHome className="icon" />
                  <span className="lg:block hidden">Home</span>
                </div>
              </Link>

              {/* <Link href="#">
                <div className="nav-list-v-item">
                  <BiSearch className="icon" />
                  <span className="lg:block hidden">Search</span>
                </div>
              </Link>
              <Link href="#">
                <div className="nav-list-v-item">
                  <MdOutlineExplore className="icon" />
                  <span className="lg:block hidden">Explore</span>
                </div>
              </Link>

              <Link href="#">
                <div className="nav-list-v-item">
                  <RiVideoLine className="icon" />
                  <span className="lg:block hidden">Reels</span>
                </div>
              </Link>
              <Link href="#">
                <div className="nav-list-v-item">
                  <FiSend className="icon send" />
                  <span className="lg:block hidden">Messages</span>
                </div>
              </Link>
              <Link href="#">
                <div className="nav-list-v-item">
                  <AiOutlineHeart className="icon" />
                  <span className="lg:block hidden">Notifications</span>
                </div>
              </Link> */}
              <Link href="#">
                <div
                  className="nav-list-v-item"
                  onClick={() => setToggleUpload(true)}
                >
                  <RiAddBoxLine className="icon" />
                  <span className="lg:block hidden">Create</span>
                </div>
              </Link>
              <Link href="/profile">
                <div className="nav-list-v-item">
                  {user && (
                    <Image
                      src={
                        user.photoURL ? user.photoURL : DEFAULT_PROFILE_IMAGE
                      }
                      alt="Profile Picture"
                      className="w-6 rounded-full icon"
                    />
                  )}

                  <span className="lg:block hidden">Profile</span>
                </div>
              </Link>
              <div
                className="nav-list-v-item absolute bottom-6 hover:cursor-pointer"
                onClick={handleLogOut}
              >
                <BiLogOut className="icon menu-icon" />

                <span className="lg:block hidden">Log Out</span>
              </div>
            </ul>
          </div>
        </nav>
      )}
      {toggleUpload && <Upload toggle={handleToggle} />}
    </>
  );
}

export default Nav;
