import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { BsCardImage } from "react-icons/bs";
import { db, auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

function Upload({ toggle }) {
  const [imageFile, setImageFile] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [caption, setCaption] = useState("");

  const [user, loading] = useAuthState(auth);
  let LOADING_IMAGE_URL =
    "https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif";

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
      setImageFile(file);
      setIsPreviewMode(true);
    } else {
      alert("Upload Image Only");
    }
  };
  const handleCaption = (e) => {
    setCaption(e.target.value);
  };

  const handleUploadPost = async () => {
    setIsPreviewMode(false);
    toggle(true);
    try {
      //add a post with loading icon that will get updated with shared image
      const postRef = await addDoc(collection(db, "posts"), {
        displayName: user.displayName,
        profilePic: user.photoURL,
        uid: user.uid,
        timestamp: serverTimestamp(),
        imageUrl: LOADING_IMAGE_URL,
        caption: caption,
      });

      //upload image to cloud
      const filePath = `${auth.currentUser.uid}/${postRef.id}/${imageFile.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, imageFile);

      //generate public url for the file
      const publicImageUrl = await getDownloadURL(newImageRef);

      //update post placeholder with image url
      await updateDoc(postRef, {
        imageUrl: publicImageUrl,
        storageUri: fileSnapshot.metadata.fullPath,
      });
    } catch (error) {
      console.error(
        "There was an error uploading file to Cloud Storage:",
        error
      );
    }
  };

  const dropped = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files)[0];

    if (/\.(jpg|jpeg|png|gif)$/i.test(files.name)) {
      setImageFile(files);
      setIsPreviewMode(true);
    } else {
      alert("Upload Image Only");
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleBack = () => {
    setIsPreviewMode(false);
    setImageFile("");
  };

  return (
    <div className="w-full fixed top-0 flex h-[100vh] justify-center items-center bg-modalbg">
      {/* <div
        className="absolute right-[150px] top-10 text-xl hover:cursor-pointer hover:text-white"
        onClick={() => toggle(true)}
      >
        &times;
      </div> */}
      {!isPreviewMode && (
        <div className="bg-white w-3/4 py-4 h-1/2 flex flex-col items-center rounded-xl">
          <div className="flex items-center justify-between w-full pb-4 border-b-2 border-bgrey ">
            <button className="ml-4" onClick={() => toggle(true)}>
              <MdKeyboardBackspace />
            </button>
            <div className="upload-title text-center mx-[auto]">
              Create new post
            </div>
          </div>

          <div className="w-full h-4/5 flex flex-col items-center justify-center mt-8">
            <div
              className="flex flex-col items-center"
              onDrop={dropped}
              onDragOver={handleDragOver}
            >
              <BsCardImage className="text-[70px]" />
              <p className="mt-4">Drag photos here</p>
            </div>
            <input
              type="file"
              id="fileInput"
              className="fileInput mt-8 hover:cursor-pointer"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      )}
      {isPreviewMode && (
        <div className="md:w-1/2 md:min-h-1/2 w-full bg-white py-4 flex flex-col items-center rounded-xl">
          <div className="flex justify-between items-center w-full pb-4 px-4">
            <button className="back-btn" onClick={handleBack}>
              <MdKeyboardBackspace />
            </button>
            <div>Create new post</div>
            <button
              className="text-sm text-formblue"
              onClick={handleUploadPost}
            >
              Share
            </button>
          </div>

          <div className="preview-box relative min-h-[300px] min-w-[300px] overflow-hidden">
            <Image
              src={URL.createObjectURL(imageFile)}
              alt="Post Preview"
              fill
              className="object-cover"
            />
          </div>

          <label htmlFor="captionInput" className="mt-2 w-full">
            <textarea
              rows="4"
              cols="40"
              value={caption}
              placeholder="Write a caption..."
              className="resize-none p-3 text-xs bg-white outline-none"
              onChange={handleCaption}
            ></textarea>
          </label>
        </div>
      )}
    </div>
  );
}
export default Upload;
