"use client";

import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Images from "../components/Images";
import Followers from "../components/Followers";
import Following from "../components/Following";
import EditProfile from "../components/EditProfile";
import Image from "next/image";

function Profile({ searchParams }) {
  const data = { ...searchParams };

  let DEFAULT_PROFILE_IMAGE =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const [posts, setPosts] = useState([]);
  const [ff, setFF] = useState([]);
  const [containId, setContainId] = useState([]);
  const [activeTab, setActiveTab] = useState("images");
  const [editProfile, setEditProfile] = useState(false);
  const [userData, setUserData] = useState([]);

  const displayName = ff?.[0]?.displayName?.toLowerCase() ?? "";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //get user docid
  const getUserdoc = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", `${user.uid}`)
      );

      onSnapshot(userQuery, (snapshot) => {
        let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        setUserData(arr);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = (action) => {
    if (action === "follow") {
      follow();
    } else if (action === "unfollow") {
      unfollow();
    }
  };

  //follow and unfollow
  const follow = async () => {
    const docRef1 = doc(db, "users", ff[0].id);
    await updateDoc(docRef1, {
      follower: arrayUnion({
        id: userData[0].uid,
        displayName: userData[0].displayName,
        profilepic: userData[0].profilePic,
      }),
    });

    //get user's doc id
    //2. update doc with who user is following
    const docRef2 = doc(db, "users", userData[0].id);
    await updateDoc(docRef2, {
      following: arrayUnion({
        id: ff[0].uid,
        displayName: ff[0].displayName,
        profilepic: ff[0].profilePic,
      }),
    });
  };

  const unfollow = async () => {
    const docRef1 = doc(db, "users", ff[0].id);
    await updateDoc(docRef1, {
      follower: arrayRemove({
        id: userData[0].uid,
        displayName: userData[0].displayName,
        profilepic: userData[0].profilePic,
      }),
    });

    //get user's doc id
    //2. update doc with who user is following
    const docRef2 = doc(db, "users", userData[0].id);
    await updateDoc(docRef2, {
      following: arrayRemove({
        id: ff[0].uid,
        displayName: ff[0].displayName,
        profilepic: ff[0].profilePic,
      }),
    });
  };

  const loadPosts = () => {
    const postsQuery = query(
      collection(db, "posts"),
      where("uid", "==", `${data ? data.uid : ""}`)
    );

    const getPost = onSnapshot(postsQuery, (snapshot) => {
      let arr = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
      setPosts(arr);
    });

    return getPost;
  };

  const loadff = () => {
    const ffQuery = query(
      collection(db, "users"),
      where("uid", "==", `${data ? data.uid : ""}`)
    );

    const getff = onSnapshot(ffQuery, (snapshot) => {
      let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      setFF(arr);
      let followingArr = arr[0]?.follower;
      let ids = followingArr ? followingArr.map((item) => item.id) : "";
      setContainId(ids);
    });

    return getff;
  };

  useEffect(() => {
    getUserdoc();
    loadPosts();
    loadff();
  }, [user]);

  return (
    <>
      <div className="w-10/12 md:w-3/5 mx-auto my-12">
        <div className="border-b-2 border-bgrey">
          <div className="flex gap-4 items-center py-4">
            <div className="relative w-14 h-14 ">
              {ff && (
                <Image
                  src={
                    ff[0]?.profilePic ? ff[0].profilePic : DEFAULT_PROFILE_IMAGE
                  }
                  alt="Profile Picture"
                  className="object-cover rounded-full"
                  fill
                  aria-label="Profile Picture"
                  title="Profile"
                />
              )}
            </div>

            <div className="profile-info">
              {ff && <p>{ff[0]?.displayName}</p>}

              {ff && user && ff[0]?.uid === user.uid ? (
                <button
                  className="text-xs mt-1 font-bold rounded-lg py-2 px-12 bg-bgrey"
                  onClick={() => setEditProfile(!editProfile)}
                  aria-label="Button to edit profile"
                >
                  Edit profile
                </button>
              ) : (
                <div>
                  {containId.includes(user?.uid) ? (
                    <button
                      className="py-1 px-6 mt-1 rounded-lg bg-blue text-white text-sm font-semibold"
                      onClick={() => handleAction("unfollow")}
                      aria-label="Unfollow button"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="py-1 px-6 mt-1 rounded-lg bg-blue text-white text-sm font-semibold"
                      onClick={() => handleAction("follow")}
                      aria-label="Follow button"
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </div>
            {editProfile && (
              <div className="w-full fixed top-0 left-0 flex h-[100vh] justify-center items-center bg-modalbg z-10">
                <EditProfile setEditProfile={setEditProfile} ffData={ff} />
              </div>
            )}
          </div>
          <p className="mb-4">
            {ff[0]?.name ? ff[0].name : <span className="text-grey">name</span>}
          </p>
        </div>
        <div className="relative flex items-center justify-between text-center py-4 text-sm border-b-2 border-bgrey">
          <button
            className="posts w-1/3"
            onClick={() => handleTabChange("images")}
          >
            {posts.length} <br />
            posts
            {activeTab === "images" && (
              <span className="absolute border-b-2 border-black w-1/3 bottom-[-1px] left-0"></span>
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
              <span className="absolute border-b-2 border-black w-1/3 bottom-[-1px] left-1/3"></span>
            )}
          </button>
          <button
            className="following w-1/3"
            onClick={() => handleTabChange("following")}
          >
            {ff[0]?.following ? ff[0].following.length : 0}
            <br /> following
            {activeTab === "following" && (
              <span className="absolute border-b-2 border-black w-1/3 bottom-[-1px] left-2/3"></span>
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
