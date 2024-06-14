const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // cho phép tất cả các origin truy cập

// Hoặc chỉ cho phép một số origin cụ thể
// app.use(cors({
//   origin: 'http://127.0.0.1:5500'
// }));

// Đoạn code xử lý các yêu cầu tại đây

app.get('/users', (req, res) => {
  // Xử lý yêu cầu lấy danh sách người dùng
  res.json({ users: [] }); // Trả về một danh sách người dùng rỗng cho mục đích minh họa
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});