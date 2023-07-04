"use client";
// import Nav from "@/components/Nav";
import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Images from "./components/Images";
import Followers from "./components/Followers";
import Following from "./components/Following";
import EditProfile from "./components/EditProfile";
import Image from "next/image";
function Profile() {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const [posts, setPosts] = useState([]);
  const [ff, setFF] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [editProfile, setEditProfile] = useState(false);

  console.log(editProfile);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //get posts === user.id
  const loadPosts = () => {
    const postsQuery = query(
      collection(db, "posts"),
      where("uid", "==", `${user ? user.uid : ""}`)
    );

    const getPost = onSnapshot(postsQuery, (snapshot) => {
      let arr = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      setPosts(arr);
    });

    return getPost;
  };
  //get posts === user.id
  const loadff = () => {
    const ffQuery = query(
      collection(db, "users"),
      where("uid", "==", `${user ? user.uid : ""}`)
    );

    const getff = onSnapshot(ffQuery, (snapshot) => {
      let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      setFF(arr);
    });

    return getff;
  };

  useEffect(() => {
    // if (!user) route.push("/auth/signup");
    loadPosts();
    loadff();
  }, [user, loading]);

  return (
    <>
      <div className="w-10/12 md:w-3/5 mx-auto my-12">
        <div className="border-b-2 border-bgrey">
          <div className="flex gap-4 items-center py-4">
            {user && (
              <Image
                src={user.photoURL}
                alt="Profile Picture"
                className="w-14"
              />
            )}

            <div className="profile-info">
              {user && <p>{user.displayName}</p>}
              <button
                className="text-xs mt-1 font-bold rounded-lg py-2 px-12 bg-bgrey"
                onClick={() => setEditProfile(!editProfile)}
              >
                Edit profile
              </button>
            </div>
            {editProfile && (
              <div className="w-full fixed top-0 left-0 flex h-[100vh] justify-center items-center bg-modalbg z-10">
                <EditProfile setEditProfile={setEditProfile} ffData={ff} />
              </div>
            )}
          </div>
          <p className="mb-4">{ff[0]?.name ? ff[0].name : "add name"}</p>
        </div>
        <div className="relative flex items-center justify-between text-center py-4 text-sm border-b-2 border-bgrey">
          <button
            className="posts w-1/3"
            onClick={() => handleTabChange("images")}
          >
            {posts.length} <br />
            posts
            {activeTab === "images" && (
              <div className="absolute border-b-2 border-black w-1/3 bottom-[-1px] left-0"></div>
            )}
          </button>
          <button
            className="followers w-1/3"
            onClick={() => handleTabChange("followers")}
          >
            {ff[0]?.follower ? ff[0].follower.length : 0}
            <br />
            followers
            {activeTab === "followers" && (
              <div className="absolute border-b-2 border-black w-1/3 bottom-[-1px] left-1/3"></div>
            )}
          </button>
          <button
            className="following w-1/3"
            onClick={() => handleTabChange("following")}
          >
            {ff[0]?.following ? ff[0].following.length : 0}
            <br /> following
            {activeTab === "following" && (
              <div className="absolute border-b-2 border-black w-1/3 bottom-[-1px] left-2/3"></div>
            )}
          </button>
        </div>
        {/* content */}
        <div className="w-full">
          {activeTab === "images" && <Images posts={posts} />}
          {activeTab === "followers" && <Followers ffData={ff} />}
          {activeTab === "following" && <Following ffData={ff} />}
        </div>
      </div>
    </>
  );
}

export default Profile;
