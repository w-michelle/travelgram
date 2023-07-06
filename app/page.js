"use client";
import Image from "next/image";
import Nav from "@/components/Nav";
import Navtop from "@/components/Navtop";
import Post from "@/components/Post";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/utils/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  orderBy,
  addDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const createUserDoc = async () => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", `${user ? user.uid : ""}`)
      );
      onSnapshot(userQuery, (snapshot) => {
        let arr = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (arr.length === 0) {
          addDoc(collection(db, "users"), {
            displayName: user.displayName,
            profilePic: user.photoURL,
            uid: user.uid,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else {
      createUserDoc();
    }
  }, [user]);

  return (
    <main>
      <Navtop />
      <Post />
    </main>
  );
}
