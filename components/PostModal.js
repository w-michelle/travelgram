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

  const handleClose = () => {
    toggle();
    console.log(post);
  };

  const deletePost = async () => {
    const docRef = doc(db, "posts", post.id);
    await deleteDoc(docRef);
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
    // I HAVE TO GET USER'S DOC ID
    const docRef2 = doc(db, "users", creatorInfo[0].id);
    await updateDoc(docRef2, {
      follower: arrayUnion({
        id: userInfo[0].uid,
        displayName: userInfo[0].displayName,
        profilepic: userInfo[0].profilePic,
      }),
    });
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
    console.log(creatorInfo);
    console.log(userInfo);
    //update user onto followed user
    // I HAVE TO GET USER'S DOC ID
    const docRef2 = doc(db, "users", creatorInfo[0].id);
    await updateDoc(docRef2, {
      follower: arrayRemove({
        id: userInfo[0].uid,
        displayName: userInfo[0].displayName,
        profilepic: userInfo[0].profilePic,
      }),
    });
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getCreator();
  }, [user]);

  //if this post id === user.uid this post is user's then remove
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
            {/* {
                            userInfo ? (
                                <li className="post-modal-item delete-post" onClick={follow}>follow</li>
                            )
                            : (
                                <li className="post-modal-item delete-post" onClick={unfollow}>unfollow</li>
                            )
                        } */}
            <li
              className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer"
              onClick={() => follow()}
            >
              follow
            </li>
            <li
              className="post-modal-item border-b-2 border-bgrey p-4 hover:cursor-pointer"
              onClick={() => unfollow()}
            >
              unfollow
            </li>
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
