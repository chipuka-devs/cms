import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxmgec7lMOvTAyTd2_vi8eFB1Na4VCu0A",
  authDomain: "choir-web-app.firebaseapp.com",
  projectId: "choir-web-app",
  storageBucket: "choir-web-app.appspot.com",
  messagingSenderId: "727169626617",
  appId: "1:727169626617:web:be25602a7d766d94074d28",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firebaseTimeStamp = Timestamp;

export { app, db, firebaseTimeStamp };
