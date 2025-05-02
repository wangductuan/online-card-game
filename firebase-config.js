// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCig0Z7mku3A0920dAAmJ8QOAGSY2qov34",
  authDomain: "wang-2025.firebaseapp.com",
  databaseURL: "https://wang-2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wang-2025",
  storageBucket: "wang-2025.appspot.com",
  messagingSenderId: "112722745227",
  appId: "1:112722745227:web:133ac984a65668b187018e",
  measurementId: "G-8W4VN0QM5T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
