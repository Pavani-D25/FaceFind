// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu5Xc2MGy8ifVG0mG1awH5vM3-PZwjgaQ",
  authDomain: "facefind-9cbc5.firebaseapp.com",
  projectId: "facefind-9cbc5",
  storageBucket: "facefind-9cbc5.firebasestorage.app",
  messagingSenderId: "592804734499",
  appId: "1:592804734499:web:c84b32595819650410f396",
  measurementId: "G-1WNDBFQQZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;