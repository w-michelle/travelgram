import { auth } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Images = ({ posts }) => {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="grid grid-cols-3 gap-1 ">
      {posts?.map((post) => (
        <div className="relative grid-photo-wrapper pb-[100%]" key={user.uid}>
          <Link href={{ pathname: `/post/${post.id}`, query: { ...post } }}>
            <Image
              src={post.imageUrl}
              alt="Posts Image"
              fill
              className="grid-photo w-full h-full object-cover"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Images;
