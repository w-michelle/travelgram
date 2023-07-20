import { auth, db } from "@/utils/firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdKeyboardBackspace } from "react-icons/md";

function EditProfile({ setEditProfile, ffData }) {
  const [user, loading] = useAuthState(auth);
  const [imageFile, setImageFile] = useState("");
  const [displayname, setDisplayName] = useState(user.displayName);
  const [name, setName] = useState(ffData[0].displayName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditProfile(false);

    //upload image to cloud
    const filePath = `${auth.currentUser.uid}/${imageFile.name}`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, imageFile);

    //generate public url for the file
    const publicImageUrl = await getDownloadURL(newImageRef);

    const image = imageFile !== "" ? publicImageUrl : ffData[0].profilePic;

    await updateProfile(auth.currentUser, {
      displayName: displayname.toLowerCase().replace(/ /g, ""),
      photoURL: image,
    })
      .then(() => console.log("profile updated"))
      .catch((error) => console.log(error));

    const docRef = doc(db, "users", ffData[0].id);
    await updateDoc(docRef, {
      displayName: displayname.replace(/ /g, ""),
      name: name,
      profilePic: image,
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
      setImageFile(file);

      //   setIsPreviewMode(true);
    } else {
      alert("Upload Image Only");
    }
  };

  return (
    <div className="bg-white w-3/4 p-4 h-[400px] flex flex-col items-center justify-center rounded-xl">
      <div className="flex justify-between pb-4 border-b-2 border-bgrey w-full">
        <button className="ml-4" onClick={() => setEditProfile(false)}>
          <MdKeyboardBackspace />
        </button>
        <div className="upload-title text-center mx-auto">Edit profile</div>
      </div>

      <div className="w-full h-4/5 flex flex-col items-start justify-center gap-4">
        <div className="flex flex-col gap-2">
          <p>Profile Picture</p>

          <input
            type="file"
            id="fileInput"
            className=""
            onChange={handleFileSelect}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p>Display Name</p>
          <input
            type="text"
            id="displayname"
            className="py-1 px-2 rounded-md bg-bgrey"
            value={displayname}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p>Name</p>
          <input
            type="text"
            id="name"
            className="py-1 px-2 rounded-md bg-bgrey"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="py-2 px-4 bg-formblue text-white rounded-md"
      >
        Submit
      </button>
    </div>
  );
}

export default EditProfile;
