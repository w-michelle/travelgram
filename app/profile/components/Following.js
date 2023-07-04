import { auth, db } from "@/utils/firebase";
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
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Following = ({ ffData }) => {
  const [followedUser, setFollowedUser] = useState([]);

  console.log(ffData);
  const getFollowedUser = (followingid) => {
    console.log(followingid);
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", `${followingid}`)
    );

    const getarr = onSnapshot(userQuery, (snapshot) => {
      let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFollowedUser(arr);
      unfollow(arr);
    });
    return getarr;
  };

  const unfollow = async (arr) => {
    console.log(arr);
    const docRef = doc(db, "users", ffData[0].id);
    await updateDoc(docRef, {
      following: arrayRemove({
        id: arr[0]?.uid,
        displayName: arr[0]?.displayName,
        profilepic: arr[0]?.profilePic,
      }),
    });

    const docRef2 = doc(db, "users", arr[0].id);
    await updateDoc(docRef2, {
      following: arrayRemove({
        id: ffData[0].uid,
        displayName: ffData[0].displayName,
        profilepic: ffData[0].profilePic,
      }),
    });
  };

  if (!ffData[0].following) {
    return (
      <div className="w-full flex justify-center mt-8">
        <Link href="/">
          <button className="py-2 px-4 bg-formblue text-white rounded-md">
            Discover people
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center mt-8">
      {ffData[0]?.following.map((following) => (
        <div
          key={following.id}
          className="flex items-center justify-between w-[280px] p-2"
        >
          <div className="flex gap-1 items-center">
            <div className="w-7 h-7 relative">
              {following && (
                <Image
                  src={following.profilepic}
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div>{following && <p>{following.displayName}</p>}</div>
          </div>
          <div>
            <button
              className="border-[1px] border-black py-1 px-3"
              onClick={() => getFollowedUser(following.id)}
            >
              following
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Following;
