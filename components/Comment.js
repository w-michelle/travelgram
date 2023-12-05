"use client";
import { useRouter } from "next/navigation";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
export default function Comment({ ...params }) {
  const router = useRouter();
  const routeData = params;
  const [allComments, setAllComments] = useState([]);

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const docSnap = await getDoc(docRef);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllComments(snapshot.data()?.comments);
    });
    return unsubscribe;
  };
  useEffect(() => {
    if (!router) return;
    getComments();
  }, [router]);

  return (
    <div className="w-full z-20">
      {allComments?.map((comment) => (
        <div key={comment.uid} className="comment-container px-2">
          <div className="comment-caption mb-4 flex items-center gap-2">
            <div className="relative w-7 h-7">
              <Image
                src={comment.profilePic}
                alt="Profile Picture"
                className="w-6 rounded-full mr-2"
                fill
              />
            </div>

            <p className="comment text-xs">
              <Link
                href={{
                  pathname: `/profile/${comment.uid}`,
                  query: { uid: comment.uid },
                }}
              >
                <strong className="comment-username mr-2">
                  {comment.displayName}
                </strong>
              </Link>
              {comment.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
