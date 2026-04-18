import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvfzVvhv3lDC4rzJvgbMXJK-trh65Eg1M",
  authDomain: "teaching-hours-ae6a1.firebaseapp.com",
  projectId: "teaching-hours-ae6a1",
  storageBucket: "teaching-hours-ae6a1.firebasestorage.app",
  messagingSenderId: "239533580131",
  appId: "1:239533580131:web:19841566c3d777a7eafd56",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_EMAIL = "fadilrafeek29@gmail.com";
