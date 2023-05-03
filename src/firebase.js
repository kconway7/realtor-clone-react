// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpvqi8Kfirie03wJsD2GGsTXy5r2aGHfA",
  authDomain: "realtor-clone-react-cb300.firebaseapp.com",
  projectId: "realtor-clone-react-cb300",
  storageBucket: "realtor-clone-react-cb300.appspot.com",
  messagingSenderId: "816563092740",
  appId: "1:816563092740:web:2e99f5ee049199155ca451",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
