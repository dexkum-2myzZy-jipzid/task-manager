// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFg1W_R_tKroGnfX4wMN42DqjbJsHbGig",
  authDomain: "task-manager-5494b.firebaseapp.com",
  projectId: "task-manager-5494b",
  storageBucket: "task-manager-5494b.appspot.com",
  messagingSenderId: "70930723227",
  appId: "1:70930723227:web:346f1ca11453cdaa10f13e",
  measurementId: "G-713ZK7JS43",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
