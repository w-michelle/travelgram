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

function EditProfile({ setEditProfile, ffData }) {
  const [user, loading] = useAuthState(auth);
  const [imageFile, setImageFile] = useState("");
  const [displayname, setDisplayName] = useState(user.displayName);
  const [name, setName] = useState("");

  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditProfile(false);

    //upload image to cloud
    const filePath = `${auth.currentUser.uid}/${imageFile.name}`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, imageFile);

    //generate public url for the file
    const publicImageUrl = await getDownloadURL(newImageRef);

    const image = imageFile.length > 0 ? publicImageUrl : ffData[0].profilePic;

    await updateProfile(auth.currentUser, {
      displayName: displayname.replace(/ /g, ""),
      photoURL: image,
    })
      .then(() => console.log("profile updated"))
      .catch((error) => console.log(error));

    const docRef = doc(db, "users", ffData[0].id);
    await updateDoc(docRef, {
      displayName: displayname.replace(/ /g, ""),
      name: name,
      profilePic: publicImageUrl,
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
      setImageFile(file);
      console.log(file);
      //   setIsPreviewMode(true);
    } else {
      alert("Upload Image Only");
    }
  };
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div className="bg-white w-3/4 p-4 h-1/2 flex flex-col items-center justify-center rounded-xl">
      <div className="upload-title text-center pb-4 border-b-2 border-bgrey w-full">
        Edit profile
      </div>

      <div className="w-full h-4/5 flex flex-col items-start justify-center gap-4">
        <div className="flex gap-1 items-center">
          <p>Profile Picture</p>

          <input
            type="file"
            id="fileInput"
            className="fileInput"
            onChange={handleFileSelect}
          />
          {imageFile && <p className="py-1 px-2 bg-bgrey">{imageFile.name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <p>Display Name</p>
          <input
            type="text"
            id="displayname"
            className="displayname py-1 px-2 bg-bgrey"
            value={displayname}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <p>Name</p>
          <input
            type="text"
            id="name"
            className="name py-1 px-2 bg-bgrey"
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
