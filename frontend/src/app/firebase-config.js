// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCe3A0vLHLsxdK24CWYMVAvxwb_gMT7oDU",
  authDomain: "bloomfin-8d51a.firebaseapp.com",
  projectId: "bloomfin-8d51a",
  storageBucket: "bloomfin-8d51a.appspot.com",
  messagingSenderId: "852078713180",
  appId: "1:852078713180:web:29275d57d57e6db06ac999",
  measurementId: "G-JQZ1PET1Y3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

const db = getFirestore(app);
export { auth, db };
