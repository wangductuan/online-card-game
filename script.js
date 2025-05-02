import { db, ref, set, onValue } from './firebase-config.js';

console.log("Firebase đã kết nối!");

set(ref(db, 'game/player1'), {
  card: "Lá 1",
  question: "Bạn muốn đi đâu?"
});
