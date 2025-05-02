import { db, ref, set, onValue } from './firebase-config.js';

console.log("Firebase đã kết nối!");

set(ref(db, 'game/player1'), {
  card: "Lá 1",
  question: "Bạn muốn đi đâu?"
});

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

  let currentRoomId = null;

  function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 8);
    currentRoomId = roomId;

    set(ref(db, `rooms/${roomId}`), {
      createdAt: Date.now(),
      players: []
    }).then(() => {
      const link = `${location.origin}${location.pathname}?room=${roomId}`;
      document.getElementById("shareLink").innerHTML = `🔗 Link phòng: <a href="${link}" target="_blank">${link}</a>`;
    });
  }

  function joinRoom() {
    const roomId = document.getElementById("roomInput").value.trim();
    if (!roomId) return alert("Vui lòng nhập mã phòng!");

    get(child(ref(db), `rooms/${roomId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        currentRoomId = roomId;
        alert("Tham gia phòng thành công!");
        startDice();
      } else {
        alert("Phòng không tồn tại.");
      }
    });
  }

  // Nếu truy cập từ link có ?room=abc123
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get("room");
  if (roomFromUrl) {
    document.getElementById("roomInput").value = roomFromUrl;
    joinRoom();
  }
</script>
