"use client";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiSend } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";
import { BiBookmark } from "react-icons/bi";

import Comment from "@/components/Comment";
import { useRouter } from "next/navigation";
import { auth, db } from "@/utils/firebase";
import {
  arrayUnion,
  doc,
  arrayRemove,
  FieldValue,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
  update,
  Firestore,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { formatLogDate } from "@/utils/formatDate.js";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import Link from "next/link";
import PostModal from "@/components/PostModal";

export default function Details({ ...params }) {
  const router = useRouter();
  const routeData = params.searchParams;
  const [user, loading] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const [likedByUser, setLikeByUser] = useState([]);
  const [allLikes, setAllLikes] = useState([]);
  const [togglePost, setTogglePost] = useState(false);
  const [postId, setPostId] = useState("");

  const handleEdit = (post) => {
    setPostId(post);
    setTogglePost(true);
  };

  const handleToggle = () => {
    togglePost ? setTogglePost(false) : setTogglePost(true);
  };

  const submitComment = async () => {
    if (!auth.currentUser) return router.push("/auth/login");
    if (!comment) {
      alert("enter a comment");
    }

    const docRef = doc(db, "posts", routeData.id);

    //use arr union to create array of object of the comment to a new field inside post

    await updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        profilePic: auth.currentUser.photoURL,
        displayName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        time: Timestamp.now(),
      }),
    });
    setComment("");
  };

  const addLikedUser = async () => {
    if (!auth.currentUser) return router.push("/auth/login");

    const docRef = doc(db, "posts", routeData.id);

    await updateDoc(docRef, {
      likes: arrayUnion({
        id: auth.currentUser.uid,
        profilePic: auth.currentUser.photoURL,
        displayName: auth.currentUser.displayName,
      }),
    });
    getLikes();
  };
  const removeLike = async () => {
    if (!auth.currentUser) return router.push("/auth/login");

    const docRef = doc(db, "posts", routeData.id);

    await updateDoc(docRef, {
      likes: arrayRemove({
        id: auth.currentUser.uid,
        profilePic: auth.currentUser.photoURL,
        displayName: auth.currentUser.displayName,
      }),
    });

    getLikes();
  };

  const getLikes = async () => {
    try {
      const docRef = doc(db, "posts", routeData.id);

      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setAllLikes(snapshot.data()?.likes);
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLikes();
  }, [user, loading]);

  return (
    <div className="details-container bg-glass backdrop-blur-[10px] h-screen flex justify-center items-center p-10">
      {togglePost && <PostModal post={postId} toggle={handleToggle} />}
      <button
        className="absolute top-8 right-8 text-xl hover:text-white"
        onClick={() => router.back()}
      >
        &times;
      </button>

      <div className="md:w-3/4 lg:w-2/3 bg-white flex md:my-0 mx-auto w-full h-[70%] ">
        <div className="md:block hidden basis-7/12 relative w-full">
          <Image
            src={routeData.imageUrl}
            alt="Post image"
            className="object-cover"
            fill
          />
        </div>
        <div className="md:basis-5/12 w-full relative">
          <div className="flex items-center w-full px-2 py-4 border-b-2 border-bgrey">
            {routeData && (
              <div className="relative w-7 h-7">
                <Image
                  src={routeData.profilePic}
                  alt="Profile Picture"
                  className="object-cover rounded-full"
                  fill
                />
              </div>
            )}
            <Link
              href={{
                pathname: `/profile/${routeData.uid}`,
                query: { uid: routeData.uid },
              }}
            >
              <p className="text-xs ml-2">
                {routeData && (
                  <strong>{routeData.displayName.toLowerCase()}</strong>
                )}
              </p>
            </Link>
            <HiOutlineDotsVertical
              className="ml-auto rotate-[90deg]"
              onClick={() => handleEdit(routeData)}
            />
          </div>

          {/* comment section */}
          <div className="modal-comments max-h-1/2 overflow-y-auto">
            <div className="flex items-center w-full px-2 py-4">
              {routeData && (
                <div className="relative w-7 h-7">
                  <Image
                    src={routeData.profilePic}
                    alt="Profile Picture"
                    className="object-cover rounded-full"
                    fill
                  />
                </div>
              )}

              <div className="comment flex ml-2">
                {routeData && (
                  <Link
                    href={{
                      pathname: `/profile/${routeData.uid}`,
                      query: { uid: routeData.uid },
                    }}
                  >
                    <p className="text-xs">
                      <strong>{routeData.displayName.toLowerCase()} </strong>
                      {routeData.caption}
                    </p>
                  </Link>
                )}
              </div>
            </div>
            <Comment {...routeData} />
          </div>
          <div className="comment-like-container absolute bottom-0 w-full p-2">
            <div className="flex gap-2 py-2 text-lg border-t-2 border-bgrey">
              {allLikes?.filter((e) => e.id === user.uid).length > 0 ? (
                <AiFillHeart className="fill-heart-icon" onClick={removeLike} />
              ) : (
                <AiOutlineHeart className="heart-icon" onClick={addLikedUser} />
              )}
            </div>
            <div className="likes-bar text-xs pb-2 border-b-2 border-bgrey">
              {allLikes ? allLikes.length : "0"} likes
            </div>

            <div className="addComment flex w-full mt-4">
              <textarea
                type="text"
                placeholder="Add a comment ..."
                className="resize-none outline-none w-full h-6 text-xs bg-white"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="text"
                className="post-btn text-xs font-bold text-formblue"
                onClick={submitComment}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
