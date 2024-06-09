// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estates-6992f.firebaseapp.com",
  projectId: "mern-estates-6992f",
  storageBucket: "mern-estates-6992f.appspot.com",
  messagingSenderId: "861254291822",
  appId: "1:861254291822:web:a22e0e4acc427df5f4717f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);