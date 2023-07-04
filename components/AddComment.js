import { auth, db } from "@/utils/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
function AddComment(postID) {
  const [comment, setComment] = useState("");
  const [user, loading] = useAuthState(auth);

  const submitComment = async () => {
    if (!user) return router.push("/auth/login");

    const docRef = doc(db, "posts", postID.postID);

    await updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        profilePic: user.photoURL,
        displayName: user.displayName,
        time: Timestamp.now(),
      }),
    });
    setComment("");
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };
  return (
    <div className="mb-4 text-sm mr-2">
      <div className="flex items-center">
        <textarea
          className="placeholder-grey resize-none w-full h-10 p-2 outline-none border-none"
          placeholder="Add a comment..."
          value={comment}
          onChange={handleComment}
        ></textarea>
        {comment.length > 0 ? (
          <button
            type="text"
            className="text-formblue font-bold"
            onClick={submitComment}
          >
            Post
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AddComment;
