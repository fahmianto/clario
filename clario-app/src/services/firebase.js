import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Ganti nilainya dengan Firebase config milikmu!
// Bisa didapat di Firebase Console -> Project Settings -> General -> Web Apps
const firebaseConfig = {
  apiKey: "AIzaSyCMcg2nljx1ttbr7PdLdG76U73LMLmFcqk",
  authDomain: "clario-app-826bf.firebaseapp.com",
  projectId: "clario-app-826bf",
  storageBucket: "clario-app-826bf.firebasestorage.app",
  messagingSenderId: "588539853148",
  appId: "1:588539853148:web:5364d0328bacb4fc822999",
  measurementId: "G-MDFLKJ20ZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
