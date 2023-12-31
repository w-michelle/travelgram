"use client";
import { auth, db } from "@/utils/firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
function PostModal({ post, toggle }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState([]);
  const [containId, setContainId] = useState([]);
  const [action, setClickAction] = useState(false);
  const handleClose = () => {
    toggle();
  };

  const deletePost = async () => {
    const docRef = doc(db, "posts", post.id);
    await deleteDoc(docRef);
    router.push("/");
  };

  //follow/unfollow
  const follow = async () => {
    const docRef = doc(db, "users", userInfo[0].id);
    await updateDoc(docRef, {
      following: arrayUnion({
        id: post.uid,
        displayName: post.displayName,
        profilepic: post.profilePic,
      }),
    });

    //update user onto followed user

    const docRef2 = doc(db, "users", creatorInfo[0].id);
    await updateDoc(docRef2, {
      follower: arrayUnion({
        id: userInfo[0].uid,
        displayName: userInfo[0].displayName,
        profilepic: userInfo[0].profilePic,
      }),
    });
    setClickAction(!action);
  };

  const unfollow = async () => {
    const docRef = doc(db, "users", userInfo[0].id);
    await updateDoc(docRef, {
      following: arrayRemove({
        id: post.uid,
        displayName: post.displayName,
        profilepic: post.profilePic,
      }),
    });

    //update user onto followed user

    const docRef2 = doc(db, "users", creatorInfo[0].id);
    await updateDoc(docRef2, {
      follower: arrayRemove({
        id: userInfo[0].uid,
        displayName: userInfo[0].displayName,
        profilepic: userInfo[0].profilePic,
      }),
    });
    setClickAction(!action);
  };

  const getUser = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", `${user.uid}`)
      );

      onSnapshot(userQuery, (snapshot) => {
        let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUserInfo(arr);
      });
    } catch (error) {
      console.log(error);
    }
  };
  //get creator to get the doc id
  const getCreator = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", `${post.uid}`)
      );

      onSnapshot(userQuery, (snapshot) => {
        let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setCreatorInfo(arr);
        let followingArr = arr[0]?.follower;
        let ids = followingArr ? followingArr.map((item) => item.id) : "";
        setContainId(ids);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getCreator();
  }, [action]);

  return (
    <div
      className="post-modal-container fixed bg-bgrey w-full h-full top-0 left-0 z-50 flex justify-center items-center overflow-hidden"
      onClick={handleClose}
    >
      {user.uid === post.uid ? (
        <div className="post-modal text-sm w-[300px] rounded-2xl  bg-white relative">
          <ul className="text-center">
            <li
              className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer delete-post"
              onClick={deletePost}
            >
              Delete
            </li>

            <Link href={{ pathname: `/post/${post.id}`, query: { ...post } }}>
              <li className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer">
                Go to post
              </li>
            </Link>
            <li
              className="post-modal-item p-3 hover:cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </li>
          </ul>
        </div>
      ) : (
        <div className="post-modaltext-sm w-[300px] rounded-2xl  bg-white relative">
          <ul className="text-center">
            {containId.includes(user.uid) ? (
              <li
                className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer"
                onClick={() => unfollow()}
              >
                Unfollow
              </li>
            ) : (
              <li
                className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer"
                onClick={() => follow()}
              >
                Follow
              </li>
            )}

            <Link href={{ pathname: `/post/${post.id}`, query: { ...post } }}>
              <li className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer">
                Go to post
              </li>
            </Link>
            <li className="post-modal-item p-4 hover:cursor-pointer">Cancel</li>
          </ul>
        </div>
      )}
    </div>
  );
}
export default PostModal;
