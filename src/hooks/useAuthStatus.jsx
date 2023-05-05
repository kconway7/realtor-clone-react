import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

// Two hooks for checking if the user is logged in and a checking status
export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // if user exists (i.e. logged in) sets loggedIn to true
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  }, []);
  return { loggedIn, checkingStatus };
}
