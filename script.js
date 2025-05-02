// --- Khởi tạo Firebase ---
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Lấy đối tượng cấu hình từ Firebase Console của dự án Wang 2025 của bạn!
// THAY THẾ THÔNG TIN placeholder BÊN DƯỚI BẰNG THÔNG TIN CHÍNH XÁC CỦA BẠN
const firebaseConfig = {
  apiKey: "AIzaSyCig0Z7mku3A0920dAAmJ8QOAGSY2qov34",
  authDomain: "wang-2025.firebaseapp.com",
  projectId: "wang-2025", // Đây là ID dự án của bạn!
  storageBucket: "wang-2025.firebasestorage.app",
  messagingSenderId: "112722745227",
  appId: "1:112722745227:web:133ac984a65668b187018e",
  databaseURL: "https://wang-2025-default-rtdb.asia-southeast1.firebasedatabase.app" // Đây là URL Realtime Database của bạn!
};

// Khởi tạo Firebase App
const app = firebase.initializeApp(firebaseConfig);

// Lấy tham chiếu đến Realtime Database
const database = firebase.database();

// --- Kết thúc Khởi tạo Firebase ---

// ... (Các phần khởi tạo Firebase, biến cards, v.v. ở trên) ...

// Biến toàn cục để lưu ID của phòng chơi hiện tại mà người dùng đang tham gia
let currentGameRoomId = null;

function startGame() {
  // Ẩn khu vực thiết lập, hiển thị khu vực game UI
  document.getElementById("setupArea").style.display = "none";
  document.getElementById("gameArea").style.display = "block";

  // --- Logic game online mới bắt đầu ở đây ---

  // Bước 1: Tạo một tham chiếu mới cho một phòng chơi trong node 'gameRooms'
  // Sử dụng push() để tạo một ID duy nhất cho phòng chơi mới
  const newGameRoomRef = database.ref('gameRooms').push();

  // Lấy ID tự động tạo này. Chúng ta sẽ cần nó sau này.
  currentGameRoomId = newGameRoomRef.key;
  console.log("Đã tạo phòng chơi mới với ID:", currentGameRoomId);

  // Bước 2: Xáo trộn bộ bài đầy đủ
  const shuffledCards = shuffleArray([...cards]); // Tạo bản sao của mảng 'cards' trước khi xáo trộn

  // Bước 3: Chuẩn bị trạng thái ban đầu của phòng chơi
  const initialGameState = {
    // Lưu ý: Để xác định người chơi thực tế, bạn sẽ cần Firebase Authentication.
    // Tạm thời dùng placeholder hoặc logic đơn giản.
    // playerId1: firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous1', // Nếu dùng Auth
    // playerId2: null, // Chờ người chơi thứ 2 tham gia
    player1: { id: 'player1_placeholder', name: 'Anh ấy' }, // Placeholder
    player2: { id: 'player2_placeholder', name: 'Cô ấy' }, // Placeholder
    status: 'waiting', // Trạng thái ban đầu: chờ người chơi 2
    currentPlayerId: null, // Chưa có lượt cho đến khi đủ người chơi
    deck: shuffledCards.map(card => card.id), // Chỉ lưu ID các lá bài còn lại
    drawnCards: [], // Mảng rỗng các lá đã rút
    currentTurn: { // Trạng thái lá bài rút trong lượt hiện tại
      card1: null, // Lá bài của người chơi 1 trong lượt này
      card2: null  // Lá bài của người chơi 2 trong lượt này
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP // Ghi lại thời điểm tạo phòng
  };

  // Bước 4: Lưu trạng thái ban đầu này vào database dưới ID phòng vừa tạo
  newGameRoomRef.set(initialGameState)
    .then(() => {
      console.log("Đã lưu trạng thái game ban đầu vào database.");
      // Sau khi tạo phòng, bạn sẽ cần logic để người chơi thứ 2 tham gia
      // và thiết lập listener để theo dõi trạng thái phòng
      listenForGameState(currentGameRoomId); // Bắt đầu lắng nghe thay đổi
    })
    .catch((error) => {
      console.error("Lỗi khi lưu trạng thái game vào database:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo cho người dùng)
      alert("Không thể bắt đầu game. Vui lòng thử lại!");
      // Có thể ẩn lại khu vực game và hiển thị lại khu vực setup
      document.getElementById("setupArea").style.display = "block";
      document.getElementById("gameArea").style.display = "none";
    });

  // --- Kết thúc Logic game online mới ---

  // Các dòng này sẽ được gọi sau khi database cập nhật và listener nhận được dữ liệu
  // updateCounter();
  // document.getElementById("btn1").disabled = false;
  // document.getElementById("btn2").disabled = false;
  // Nút ban đầu có thể bị vô hiệu hóa và chỉ bật lên khi đủ 2 người và đến lượt
}

// Hàm helper để xáo trộn mảng (Thuật toán Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
  }
  return array;
}

// --- Cần thêm hàm lắng nghe trạng thái game từ database ---
function listenForGameState(roomId) {
    // Lấy tham chiếu đến node của phòng game cụ thể
    const gameRoomRef = database.ref('gameRooms/' + roomId);

    // Thiết lập listener để lắng nghe các thay đổi giá trị
    gameRoomRef.on('value', (snapshot) => {
        const gameData = snapshot.val(); // Lấy toàn bộ dữ liệu của phòng game

        if (gameData) {
            console.log("Dữ liệu game đã thay đổi:", gameData);
            // --- Cập nhật giao diện người dùng dựa trên dữ liệu gameData ---

            // Ví dụ: Cập nhật bộ đếm bài
            const remainingCount = gameData.deck ? gameData.deck.length : 0;
            document.getElementById("counter").textContent = `Còn lại: ${remainingCount} / ${cards.length} lá`;

            // Ví dụ: Hiển thị lá bài đã rút trong lượt hiện tại
            const currentTurn = gameData.currentTurn;
            if (currentTurn) {
                 // Tìm thông tin đầy đủ của lá bài từ mảng 'cards' gốc
                 const card1Info = cards.find(c => c.id === currentTurn.card1?.id);
                 const card2Info = cards.find(c => c.id === currentTurn.card2?.id);

                 if (card1Info) {
                     document.getElementById("card1").innerHTML = `<img src="${card1Info.image}" class="card-img" alt="${card1Info.label}">`;
                     document.getElementById("question1").textContent = card1Info.question;
                 } else {
                     // Hiển thị bài úp nếu chưa rút hoặc đã reset lượt
                     document.getElementById("card1").innerHTML = '<img src="back.png" class="card-img" alt="Bài úp">';
                     document.getElementById("question1").textContent = "";
                 }

                 if (card2Info) {
                     document.getElementById("card2").innerHTML = `<img src="${card2Info.image}" class="card-img" alt="${card2Info.label}">`;
                     document.getElementById("question2").textContent = card2Info.question;
                 } else {
                      // Hiển thị bài úp nếu chưa rút hoặc đã reset lượt
                     document.getElementById("card2").innerHTML = '<img src="back.png" class="card-img" alt="Bài úp">';
                     document.getElementById("question2").textContent = "";
                 }
            }

            // Ví dụ: Cập nhật trạng thái nút Rút bài (sẽ phức tạp hơn với lượt chơi thực tế)
            // Tạm thời giữ logic cũ để hiển thị nút Chơi Tiếp
             if (currentTurn && currentTurn.card1 && currentTurn.card2) {
                document.getElementById("nextBtn").style.display = "block";
                 document.getElementById("btn1").disabled = true; // Tạm thời vô hiệu hóa sau khi rút
                 document.getElementById("btn2").disabled = true; // Tạm thời vô hiệu hóa sau khi rút
             } else {
                 document.getElementById("nextBtn").style.display = "none";
                 // Logic để bật/tắt nút dựa vào lượt chơi thực tế (sẽ làm sau)
                 // Ví dụ: if (gameData.currentPlayerId === myUserId) { btn.disabled = false; }
             }

            // Ví dụ: Cập nhật nhật ký bài đã rút (đọc từ mảng drawnCards trong DB)
            const drawnLogElement = document.getElementById("drawnLog");
            drawnLogElement.innerHTML = ""; // Xóa nội dung cũ
            if (gameData.drawnCards) {
                 // Lấy thông tin đầy đủ của các lá bài đã rút
                 const fullDrawnCardsInfo = gameData.drawnCards.map(drawnCard => {
                     const cardInfo = cards.find(c => c.id === drawnCard.id);
                     return cardInfo ? `${cardInfo.label}: ${cardInfo.question} (Rút bởi: ${drawnCard.drawnBy})` : `Lá ${drawnCard.id} không rõ thông tin`;
                 });

                 fullDrawnCardsInfo.forEach(logEntry => {
                     const listItem = document.createElement("li");
                     listItem.textContent = logEntry;
                     drawnLogElement.appendChild(listItem);
                 });
            }


        } else {
            // Xử lý trường hợp phòng game không tồn tại nữa (ví dụ: bị xóa)
            console.log("Phòng game không tồn tại.");
            // Có thể hiển thị thông báo và đưa người dùng về màn hình setup
        }
    }, (error) => {
        // Xử lý lỗi khi lắng nghe database
        console.error("Lỗi khi lắng nghe database:", error);
    });
}

// --- Sửa đổi hàm drawCard để ghi vào database ---
function drawCard(player) {
   if (!currentGameRoomId) {
       console.error("Chưa tham gia hoặc tạo phòng game.");
       return; // Không làm gì nếu chưa có phòng game
   }

   // Lấy tham chiếu đến node của phòng game hiện tại
   const gameRoomRef = database.ref('gameRooms/' + currentGameRoomId);

   // Để đảm bảo an toàn và xử lý lượt chơi, chúng ta nên sử dụng transaction
   // hoặc Cloud Functions. Tuy nhiên, để đơn giản hóa việc nhập dữ liệu ban đầu,
   // chúng ta sẽ viết logic trực tiếp (LƯU Ý: Điều này dễ bị race condition
   // nếu hai người chơi cùng cố gắng rút bài đồng thời).
   // Cách tốt hơn sẽ cần kiểm tra lượt chơi và sử dụng transaction.

   // Tạm thời, đọc dữ liệu hiện tại của phòng game
   gameRoomRef.once('value') // Đọc dữ liệu MỘT LẦN
     .then(snapshot => {
       const gameData = snapshot.val();
       if (gameData && gameData.deck && gameData.deck.length > 0) {
         // Lấy lá bài ngẫu nhiên từ mảng deck ID trong database
         const deckIds = gameData.deck;
         const randomIndex = Math.floor(Math.random() * deckIds.length);
         const drawnCardId = deckIds[randomIndex];

         // Tìm thông tin đầy đủ của lá bài từ mảng 'cards' gốc
         const drawnCardInfo = cards.find(c => c.id === drawnCardId);

         if (!drawnCardInfo) {
             console.error("Không tìm thấy thông tin lá bài với ID:", drawnCardId);
             return;
         }

         // Tạo bản sao của deck để xóa lá bài đã rút
         const updatedDeckIds = [...deckIds];
         updatedDeckIds.splice(randomIndex, 1); // Xóa lá bài đã rút

         // Tạo đối tượng lá bài đã rút để lưu vào drawnCards
         const drawnCardForLog = {
             id: drawnCardInfo.id,
             question: drawnCardInfo.question,
             // drawnBy: firebase.auth().currentUser ? firebase.auth().currentUser.uid : 'anonymous_player_' + player, // ID người dùng thực tế
             drawnBy: 'player_' + player, // Placeholder người chơi
             timestamp: firebase.database.ServerValue.TIMESTAMP
         };

         // Cập nhật trạng thái trong database
         // Lưu ý: Sử dụng update() để chỉ



// Dữ liệu bài (vẫn giữ nguyên trong mã này để dễ tham chiếu,
// nhưng trạng thái bộ bài thực tế sẽ được quản lý trong Firebase DB)
const cards = [
  { id: 1, label: "Lá 1", question: "Nếu chúng ta có thể đi du lịch đâu đó, bạn muốn đi đâu?", image: "cards/card1.png" },
  { id: 2, label: "Lá 2", question: "Món ăn yêu thích nhất của bạn là gì?", image: "cards/card2.png" },
  { id: 3, label: "Lá 3", question: "Khi nào bạn cảm thấy hạnh phúc nhất bên tôi?", image: "cards/card3.png" },
  { id: 4, label: "Lá 4", question: "Bạn thích nhất điều gì ở tôi?", image: "cards/card4.png" },
  { id: 5, label: "Lá 5", question: "Bạn sẽ làm gì nếu chúng ta phải xa nhau một thời gian dài?", image: "cards/card5.png" },
  { id: 6, label: "Lá 6", question: "Cái gì làm bạn cảm thấy yêu tôi hơn mỗi ngày?", image: "cards/card6.png" },
  { id: 7, label: "Lá 7", question: "Bạn có những thói quen kỳ lạ nào mà tôi chưa biết?", image: "cards/card7.png" },
  { id: 8, label: "Lá 8", question: "Bạn nghĩ gì khi nhìn thấy chúng ta trong 5 năm tới?", image: "cards/card8.png" },
  { id: 9, label: "Lá 9", question: "Điều gì khiến bạn cảm thấy bị thu hút khi lần đầu gặp tôi?", image: "cards/card9.png" },
  { id: 10, label: "Lá 10", question: "Món quà lãng mạn nhất mà bạn từng nhận được là gì?", image: "cards/card10.png" },
  { id: 11, label: "Lá 11", question: "Điều gì khiến bạn cười nhiều nhất khi chúng ta ở bên nhau?", image: "cards/card11.png" },
  { id: 12, label: "Lá 12", question: "Nếu bạn có thể thay đổi một điều trong quá khứ của chúng ta, bạn sẽ làm gì?", image: "cards/card12.png" },
  { id: 13, label: "Lá 13", question: "Câu chuyện yêu thích của chúng ta là gì?", image: "cards/card13.png" },
  { id: 14, label: "Lá 14", question: "Điều gì làm bạn tự hào khi có tôi bên cạnh?", image: "cards/card14.png" },
  { id: 15, label: "Lá 15", question: "Bạn nghĩ sao về tương lai của chúng ta?", image: "cards/card15.png" },
  { id: 16, label: "Lá 16", question: "Bạn nghĩ gì khi tôi làm một điều bất ngờ cho bạn?", image: "cards/card16.png" },
  { id: 17, label: "Lá 17", question: "Điều gì là điều mà bạn nghĩ chúng ta cần cải thiện trong mối quan hệ này?", image: "cards/card17.png" },
  { id: 18, label: "Lá 18", question: "Bạn cảm thấy thế nào khi tôi giữ khoảng cách?", image: "cards/card18.png" },
  { id: 19, label: "Lá 19", question: "Chúng ta có thể làm gì để khiến mối quan hệ này thêm sâu sắc hơn?", image: "cards/card19.png" },
  { id: 20, label: "Lá 20", question: "Bạn có thể sống mà không có tôi bên cạnh không?", image: "cards/card20.png" },
  { id: 21, label: "Lá 21", question: "Điều nào bạn không bao giờ muốn thay đổi về mối quan hệ của chúng ta?", image: "cards/card21.png" },
  { id: 22, label: "Lá 22", question: "Nếu có một thứ bạn muốn chúng ta làm chung mãi mãi, đó sẽ là gì?", image: "cards/card22.png" },
  { id: 23, label: "Lá 23", question: "Bạn có nghĩ rằng tình yêu của chúng ta có thể vượt qua thử thách thời gian?", image: "cards/card23.png" },
  { id: 24, label: "Lá 24", question: "Bạn cảm thấy thế nào khi tôi dành cho bạn thời gian riêng tư?", image: "cards/card24.png" },
  { id: 25, label: "Lá 25", question: "Điều gì bạn thấy tiếc nuối khi nhìn lại quãng thời gian
