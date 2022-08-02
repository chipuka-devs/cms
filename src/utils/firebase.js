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
// const firebaseConfig = {
//   apiKey: "AIzaSyAWDh1UUlPgUFLb0bQhOu-TfAUCIoHR5LQ",
//   authDomain: "app-contributions.firebaseapp.com",
//   projectId: "app-contributions",
//   storageBucket: "app-contributions.appspot.com",
//   messagingSenderId: "482592875267",
//   appId: "1:482592875267:web:4eeb0a2261256660483f36",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firebaseTimeStamp = Timestamp;

export { app, db, firebaseTimeStamp };
