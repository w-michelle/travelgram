"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";

import { RiAddBoxLine } from "react-icons/ri";

import { BiLogOut } from "react-icons/bi";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/utils/firebase";
import Upload from "./Upload";
import { Lobster } from "next/font/google";
import Image from "next/image";

const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
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
                <AiOutlineHome
                  className="icon"
                  aria-label="home"
                  title="home"
                />
              </Link>

              <Link href="#">
                <RiAddBoxLine
                  className="icon"
                  onClick={() => setToggleUpload(true)}
                  aria-label="Create a Post"
                  title="Create a Post"
                />
              </Link>

              <Link
                href={{
                  pathname: `/profile/${user.uid}`,
                  query: { uid: user.uid },
                }}
              >
                <div className="w-7 h-7 relative ">
                  {user && user.photoURL ? (
                    <Image
                      src={user?.photoURL}
                      alt="Profile Picture"
                      className="w-8 rounded-full "
                      fill
                      aria-label="Profile Picture"
                      title="Profile"
                    />
                  ) : (
                    <Image
                      src={DEFAULT_PROFILE_IMAGE}
                      alt="Profile Picture"
                      className="w-8 rounded-full "
                      fill
                      aria-label="Profile Picture"
                      title="Profile"
                    />
                  )}
                </div>
              </Link>
            </ul>
          </div>
          <div className="lg:w-1/6 md:block hidden fixed top-0 h-screen w-1/8 p-4 border-r-2 border-bgrey">
            <ul className="nav-list-v flex flex-col gap-8 mt-6">
              <Link href="/">
                <h1
                  className={`lg:block lg:text-2xl hidden ${lobster.className} text-xl`}
                  title="Logo"
                  aria-label="Logo"
                >
                  Travelgram
                </h1>
              </Link>

              <Link href="/">
                <div className="nav-list-v-item">
                  <AiOutlineHome
                    className="icon"
                    aria-label="Home"
                    title="Home"
                  />
                  <span className="lg:block hidden">Home</span>
                </div>
              </Link>

              <Link href="#">
                <div
                  className="nav-list-v-item"
                  onClick={() => setToggleUpload(true)}
                >
                  <RiAddBoxLine
                    className="icon"
                    aria-label="Create a Post"
                    title="Create a Post"
                  />
                  <span className="lg:block hidden">Create</span>
                </div>
              </Link>
              <Link
                href={{
                  pathname: `/profile/${user.uid}`,
                  query: { uid: user.uid },
                }}
              >
                <div className="nav-list-v-item gap-2">
                  <div className="w-7 h-7 relative">
                    {user && user.photoURL ? (
                      <Image
                        src={user?.photoURL}
                        alt="Profile Picture"
                        className="w-8 rounded-full "
                        fill
                        aria-label="Profile Picture"
                        title="Profile"
                      />
                    ) : (
                      <Image
                        src={DEFAULT_PROFILE_IMAGE}
                        alt="Profile Picture"
                        className="w-8 rounded-full "
                        fill
                        aria-label="Profile Picture"
                        title="Profile"
                      />
                    )}
                  </div>

                  <span className="lg:block hidden">Profile</span>
                </div>
              </Link>
              <div
                className="nav-list-v-item absolute bottom-6 hover:cursor-pointer"
                onClick={handleLogOut}
              >
                <BiLogOut
                  className="icon menu-icon"
                  aria-label="Log Out"
                  title="Log Out"
                />

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
