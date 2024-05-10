import { initializeApp, getApps } from "firebase/app";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQX3H-PUEj1AUyO-X8vmBdArveo3UMNi8",
  authDomain: "intracker-base.firebaseapp.com",
  projectId: "intracker-base",
  storageBucket: "intracker-base.appspot.com",
  messagingSenderId: "633294640208",
  appId: "1:633294640208:web:245dc200e69fbce08b6d55",
  measurementId: "G-TZM9SKR1RY",
};
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider, storage, app };
