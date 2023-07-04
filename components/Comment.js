"use client";
import { useRouter } from "next/navigation";
import { auth, db } from "../utils/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { formatLogDate } from "@/utils/formatDate";
import Image from "next/image";
export default function Comment({ ...params }) {
  const router = useRouter();
  const routeData = params;
  const [allComments, setAllComments] = useState([]);

  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const docSnap = await getDoc(docRef);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllComments(snapshot.data().comments);
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
          <div className="comment-caption mb-4 flex items-center">
            <Image
              src={comment.profilePic}
              alt="Profile Picture"
              className="w-6 rounded-full mr-2"
            />

            <p className="comment text-xs">
              <strong className="comment-username mr-2">
                {comment.displayName}
              </strong>

              {comment.comment}
            </p>
          </div>
          {/* <p className="post-date">{formatLogDate(comment.time)}</p> */}
        </div>
      ))}
    </div>
  );
}
