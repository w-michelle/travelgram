"use client";
import { HiOutlineDotsVertical } from "react-icons/hi";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { TbMessageCircle2 } from "react-icons/tb";

import { useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { daysPast } from "@/utils/formatDate";
import PostModal from "./PostModal";
import AddComment from "./AddComment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BiLoaderCircle } from "react-icons/bi";
function Post() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [togglePost, setTogglePost] = useState(false);
  const [postId, setPostId] = useState("");
  const router = useRouter();
  const handleEdit = (post) => {
    setPostId(post);
    setTogglePost(true);
  };

  const handleToggle = () => {
    togglePost ? setTogglePost(false) : setTogglePost(true);
  };

  //retrieve and load post from firebase
  const loadPosts = () => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );

    //listen to query
    const getPost = onSnapshot(postsQuery, (snapshot) => {
      let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPosts(arr);
    });

    return getPost;
  };

  const addLikedUser = async (postId) => {
    if (!user) return router.push("/auth/login");

    const docRef = doc(db, "posts", postId);

    await updateDoc(docRef, {
      likes: arrayUnion({
        id: user.uid,
        profilePic: user.photoURL,
        displayName: user.displayName,
      }),
    });
  };
  const removeLike = async (postId) => {
    if (!user) return router.push("/auth/login");

    const docRef = doc(db, "posts", postId);

    await updateDoc(docRef, {
      likes: arrayRemove({
        id: user.uid,
        profilePic: user.photoURL,
        displayName: user.displayName,
      }),
    });
  };

  useEffect(() => {
    loadPosts();
  }, [user, loading]);

  const loadingImg = () => {
    return <BiLoaderCircle />;
  };

  return (
    <div className="md:mt-12 md:w-[468px] w-full my-0 mx-auto">
      <div className="mb-10">
        {togglePost && <PostModal post={postId} toggle={handleToggle} />}

        {posts?.map((post) => (
          <div key={post.id} className="post pt-4 pb-2 border-b-2 border-bgrey">
            <div className="profile_container flex items-center p-2">
              <div className="w-7 h-7 relative">
                {post && (
                  <Image
                    src={post.profilePic}
                    alt="Profile Picture"
                    fill
                    className="object-cover rounded-full"
                    aria-label="Profile Picture"
                    title="Profile"
                  />
                )}
              </div>

              <Link
                href={{
                  pathname: `/profile/${post.uid}`,
                  query: { uid: post.uid },
                }}
                className="mx-2 text-sm"
              >
                {post && (
                  <p className="font-semibold">
                    {post.displayName.toLowerCase()}
                  </p>
                )}
              </Link>
              <p className="mr-1 text-grey">•</p>
              {post && post.timestamp && (
                <div className="text-grey text-sm">
                  {daysPast(post.timestamp)}
                </div>
              )}

              <HiOutlineDotsVertical
                className="ml-auto rotate-[90deg] text-xl hover:cursor-pointer"
                onClick={() => handleEdit(post)}
                aria-label="More options on post"
                title="More options"
              />
            </div>

            <div className="">
              <div className="relative min-w-[300px] min-h-[400px]">
                <Image
                  src={post.imageUrl}
                  alt="Image of a post"
                  fill
                  className="object-cover"
                  aria-label="Post Image"
                  title="Post Image"
                />
              </div>

              <div className="flex gap-2 text-xl p-2">
                {user &&
                post.likes?.filter((e) => e.id == user.uid).length > 0 ? (
                  <AiFillHeart
                    className={`top-right-icon fill-heart-icon hover:cursor-pointer`}
                    onClick={() => removeLike(post.id)}
                    aria-label="Unlike"
                    title="Unlike"
                  />
                ) : (
                  <AiOutlineHeart
                    className={`top-right-icon heart-icon hover:cursor-pointer`}
                    onClick={() => addLikedUser(post.id)}
                    aria-label="Like"
                    title="Like"
                  />
                )}
                <Link
                  href={{ pathname: `/post/${post.id}`, query: { ...post } }}
                >
                  <TbMessageCircle2
                    className="top-right-icon bubble"
                    aria-label="Comment"
                    title="Comment"
                  />
                </Link>
              </div>
            </div>
            <div className="px-2 text-sm">
              {post.likes ? post.likes.length : "0"} likes
            </div>
            <div className="p-2 flex text-sm">
              <div className="font-[500] mr-1">
                <Link
                  href={{
                    pathname: `/profile/${post.uid}`,
                    query: { uid: post.uid },
                  }}
                >
                  <p>
                    <strong>{post.displayName.toLowerCase()}</strong>{" "}
                    {post.caption}
                  </p>
                </Link>
              </div>
            </div>
            <Link href={{ pathname: `/post/${post.id}`, query: { ...post } }}>
              <button className="px-2 text-grey text-sm">
                View all {post.comments ? post.comments.length : ""} comments
              </button>
            </Link>

            <AddComment postID={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
