// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  // Dán config của bạn ở đây
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCig0Z7mku3A0920dAAmJ8QOAGSY2qov34",
  authDomain: "wang-2025.firebaseapp.com",
  databaseURL: "https://wang-2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wang-2025",
  storageBucket: "wang-2025.firebasestorage.app",
  messagingSenderId: "112722745227",
  appId: "1:112722745227:web:133ac984a65668b187018e",
  measurementId: "G-8W4VN0QM5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
