import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aapki Original Keys jo aapne bheji thin
const firebaseConfig = {
  apiKey: "AIzaSyCFEqycZonzVZnfRBjBUZpx8fA1Vrz3m5A",
  authDomain: "shop-with-mukuu.firebaseapp.com",
  projectId: "shop-with-mukuu",
  storageBucket: "shop-with-mukuu.firebasestorage.app",
  messagingSenderId: "814428951768",
  appId: "1:814428951768:web:a9e43db094cbfa7410f3ad"
};

// App start karna
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
