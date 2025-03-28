const express = require('express');
const cors = require('cors');
const runnerRouter = require('./routes/runner.route');
const runRouter = require('./routes/run.route');

require('dotenv').config();

const app = express(); //สร้าง Web Server

const PORT = process.env.PORT || 5555; //เรียกใช้ค่า PORT จาก .env

//ใช้ตัว middleware ในการจัดการ
//การเรียกใช้งานข้าม domain
app.use(cors());
// CORS configuration
// const corsOptions = {
//     origin: "*", // อนุญาตทุก origin หรือกำหนดเฉพาะโดเมนเว็บไซต์ฟรอนต์เอนด์ของคุณ
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions)); // ใช้งาน cors สำหรับการทำงานร่วมกับ Web Server อื่นๆ


//ข้อมูล JSON จาก client/user
app.use(express.json());
//เส้นทาง
app.use('/runner', runnerRouter);
app.use('/run', runRouter);
//การเข้าถึงไฟล์ ในที่นี้คือรูป
//การเข้าถึงไฟล์ ในที่นี้คือรูป
const path = require('path');
app.use('/images/runner', express.static(path.join(__dirname, 'images/runner')));
app.use('/images/run', express.static(path.join(__dirname, 'images/run')));

//เขียนคำสั่งเพื่อเทส เพื่อให้ client/user เข้าถึง resource ใน server
app.get('/', (req, res) => {
    res.json({
        message: `Welcome to backend run server service`
    })
})

//คำสั่งที่ใช้เปิด server เพื่อให้ client/user เข้าถึง resource ใน server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} .....`);
})