import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Ye line add ki hai

// Aapki keys (Same rahengi)
const firebaseConfig = {
  apiKey: "AIzaSyCFEqycZonzVZnfRBjBUZpx8fA1Vrz3m5A",
  authDomain: "shop-with-mukuu.firebaseapp.com",
  projectId: "shop-with-mukuu",
  storageBucket: "shop-with-mukuu.firebasestorage.app",
  messagingSenderId: "814428951768",
  appId: "1:814428951768:web:a9e43db094cbfa7410f3ad"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // Ye naya export hai login ke liye
