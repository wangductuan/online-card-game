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
