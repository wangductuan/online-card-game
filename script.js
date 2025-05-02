// script.js
import { db, ref, set, onValue } from './firebase-config.js';

console.log("Firebase đã kết nối!");

// Ví dụ lưu lượt chơi
set(ref(db, 'game/player1'), {
  card: "Lá 1",
  question: "Bạn muốn đi đâu?"
});
