import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();
  //Adds functionality to google button and allows users to sign in with google
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check if user is already in database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // adds doc if user doesnt exist
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (err) {
      toast.error("Could not authorize with Google");
    }
  }

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center w-full 
    bg-red-600 text-white px-7 py-3 uppercase text-sm font-medium
    hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg
    active:shadow-lg transition duration-200 ease-in-out rounded"
    >
      {" "}
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" /> Continue with
      Google
    </button>
  );
}
