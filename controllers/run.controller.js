// จัดการเรื่อง อัปโหลดไฟล์ โดย multer
// จัดการเรื่องการทํางาน CRUD กับฐานข้อมูล โดย prisma

// require package ที่ต้องใช้ในการอัปโหลดไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// require package ที่ต้องใช้ในการทํางานกับฐานข้อมูล
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/run');
    },
    filename: (req, file, cb) => {
        cb(null, 'run_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
});
//2. ฟังก์ชันอัปโหลดไฟล์
const uploadRun = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb('Give proper files formate to upload');
    }
}).single('runImage');

