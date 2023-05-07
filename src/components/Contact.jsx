import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  function onChange(e) {
    setMessage(e.target.value);
  }

  //Retrieve landlord data from a listing including name and email
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);

  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p className="mb-1">
            Contact {landlord.name} for the {listing.name.toLowerCase()}:
          </p>
          <div>
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-400 rounded
              transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 mt-1 mb-2"
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              type="button"
              className="px-7 py-3 w-full text-center bg-blue-600 text-white font-medium rounded text-sm uppercase
            shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 focus:bg-blue-700 focus:shadow-lg
            transition duration-200 ease-in-out mb-3"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
