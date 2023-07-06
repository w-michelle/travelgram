"use client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login";
import { Oleo_Script } from "next/font/google";
const oleo_script = Oleo_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oleo-script",
});

function Auth() {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [photoUrl, setPhotoUrl] = useState("");
  const [user, loading] = useAuthState(auth);

  let DEFAULT_PROFILE_IMAGE =
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
  const userSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: displayName.replace(/ /g, ""),
        photoURL: DEFAULT_PROFILE_IMAGE,
      });

      setShowLogin(true);
      setShowSignup(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    userSignup();
  };
  const handleShow = (boo) => {
    setShowLogin(!boo);
    setShowSignup(boo);
  };

  return (
    <div className="p-6 w-full">
      {showSignup && (
        <div className="flex justify-center">
          <div className="lg:w-2/5 md:w-2/4 w-3/4">
            <h2 className="text-center font-bold text-sm">Register</h2>
            <div className="flex flex-col justify-center items-center mt-10">
              <form onSubmit={handleSignUp} className="flex flex-col w-full">
                <input
                  type="text"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />

                <input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button className="bg-formblue py-1 mt-4 rounded-md text-white font-bold">
                  Sign Up
                </button>
              </form>
              <p className="mt-10 text-sm self-start text-grey">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-fontblue"
                  onClick={() => handleShow(false)}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {showLogin && <Login handleShow={handleShow} />}
    </div>
  );
}
export default Auth;
