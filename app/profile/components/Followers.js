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
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Followers = ({ ffData }) => {
  const followingArr = ffData[0].following;
  const find = followingArr ? followingArr.map((item) => item.id) : "";

  const [user, loading] = useAuthState(auth);
  const [followerData, setFollowerData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [type, setType] = useState("");

  //GET FOLLOWER DOC ONCLICK
  const getFollower = async (type, followerid) => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", `${followerid}`)
      );

      onSnapshot(userQuery, (snapshot) => {
        let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setType(type);
        setFollowerData(arr);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const follow = async (arr) => {
    const docRef1 = doc(db, "users", arr[0].id);
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
        id: arr[0].uid,
        displayName: arr[0].displayName,
        profilepic: arr[0].profilePic,
      }),
    });
  };

  const unfollow = async (arr) => {
    const docRef1 = doc(db, "users", arr[0].id);
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
        id: arr[0].uid,
        displayName: arr[0].displayName,
        profilepic: arr[0].profilePic,
      }),
    });
  };
  //GET USER DOC ON USEFFECT
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
  useEffect(() => {
    if (followerData.length > 0) {
      if (type === "follow") {
        follow(followerData);
      } else {
        unfollow(followerData);
      }
    }
  }, [followerData]);

  useEffect(() => {
    getUserdoc();
  }, []);

  if (!ffData[0].follower) {
    return (
      <div className="w-full flex justify-center mt-8">No followers yet.</div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center mt-8">
      {ffData[0].follower?.map((follower) => (
        <div
          key={follower.id}
          className="flex items-center justify-between w-[280px] gap-2 p-2"
        >
          <div className="flex gap-1 items-center">
            <div className="w-7 h-7 relative">
              <Image
                src={follower?.profilepic}
                alt="Profile Picture"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              {follower.displayName ? (
                <p>{follower.displayName}</p>
              ) : (
                <p>anonymous</p>
              )}
            </div>
          </div>
          {ffData[0]?.uid === user.uid ? (
            <div>
              {find.includes(follower.id) ? (
                <button
                  className="border-[1px] border-black py-1 px-3"
                  onClick={() => getFollower("unfollow", follower.id)}
                >
                  unfollow
                </button>
              ) : (
                <button
                  className="border-[1px] border-black py-1 px-3"
                  onClick={() => getFollower("follow", follower.id)}
                >
                  follow
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default Followers;
