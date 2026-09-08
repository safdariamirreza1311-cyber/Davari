const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// سرو کردن فایل‌های استاتیک (مثل index.html)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// وضعیت داورها و مسیرها
let judgesStatus = {};

io.on('connection', (socket) => {
  console.log('کاربر جدید وصل شد:', socket.id);

  // ارسال آخرین وضعیت به کاربر تازه وصل شده
  socket.emit('initial_state', judgesStatus);

  // دریافت بروزرسانی وضعیت از داورها
  socket.on('update_judge', (data) => {
    judgesStatus[data.judgeId] = data;
    io.emit('judge_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('کاربر قطع شد:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
    
