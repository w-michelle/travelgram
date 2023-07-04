"use client";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { RxPerson } from "react-icons/rx";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oleo_Script } from "next/font/google";
const oleo_script = Oleo_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oleo-script",
});
function Login({ handleShow }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let DEFAULT_PROFILE_IMAGE =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

  const userLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/");
    } catch (error) {
      alert("Incorrect credentials");
    }
  };

  const guestSignIn = async () => {
    try {
      await signInAnonymously(auth);
      await updateProfile(auth.currentUser, {
        displayName: "Anonymous Panda",
        photoURL: DEFAULT_PROFILE_IMAGE,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userLogin();
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, loading]);
  return (
    <div className="flex justify-center">
      <div className="lg:w-2/5 md:w-2/4 m-4 w-3/4">
        <h1 className={`${oleo_script.className} text-xl text-center`}>
          Travelgram
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col mt-10">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          <button className="bg-formblue text-white font-bold rounded-md py-2 mt-4">
            Log in
          </button>
        </form>

        <button
          onClick={guestSignIn}
          className="text-grey bg-darkgrey border-2 border-grey py-2 px-4 w-full font-medium rounded-lg flex items-start gap-3 mb-8 mt-6 text-center"
        >
          <RxPerson className="text-2xl" /> Sign in Anonymously
        </button>
        <p className="mt-10 text-grey">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="text-fontblue"
            onClick={() => handleShow(true)}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;