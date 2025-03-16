import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNSMiuUBfODsX0iP4lcIzjPQmUo3PjXDE",
  authDomain: "qitt-student.firebaseapp.com",
  projectId: "qitt-student",
  storageBucket: "qitt-student.appspot.com",
  messagingSenderId: "942426242318",
  appId: "1:942426242318:web:5f4010933ab374317eeb5f",
  measurementId: "G-P3QLEPFYZQ",
};

// Initialize Firebase
export default initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
