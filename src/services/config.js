import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDZZyuChBZCFZ2SQa1_kCl71KjGbo6DQc4",
  authDomain: "vozzoa-ee258.firebaseapp.com",
  projectId: "vozzoa-ee258",
  storageBucket: "vozzoa-ee258.firebasestorage.app",
  messagingSenderId: "251182802235",
  appId: "1:251182802235:web:5adbf8d85fae913c3e831e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
