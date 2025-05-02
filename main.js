import { db, ref, set, onValue } from './firebase.js';

let playerId = Math.random().toString(36).substr(2, 5); // ID ngẫu nhiên
let gameRef = ref(db, 'games/my-game');

// Khi rút bài
function drawCard(cardId, player) {
  set(ref(db, `games/my-game/cards/${cardId}`), {
    player: player,
    timestamp: Date.now()
  });
}

// Lắng nghe thay đổi
onValue(ref(db, `games/my-game/cards`), (snapshot) => {
  const cards = snapshot.val();
  if (cards) {
    console.log("Các lá đã rút:", cards);
    // Cập nhật UI dựa trên cards...
  }
});
