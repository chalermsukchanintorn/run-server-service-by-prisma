// จัดการเรื่อง อัปโหลดไฟล์ โดย multer
// จัดการเรื่องการทํางาน CRUD กับฐานข้อมูล โดย prisma
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// require package ที่ต้องใช้ในการอัปโหลดไฟล์
const multer = require('multer');
const path = require('path');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dcjf7jpk1',
    api_key: '676246848198869',
    api_secret: 'G5D5h9BuBAkdwjbf7yfksTTZFas',
});

// require package ที่ต้องใช้ในการทํางานกับฐานข้อมูล
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน------------------------
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images/runner');
//     },
//     filename: (req, file, cb) => {
//         cb(null, 'runner_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
//     }
// });

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const newFileName = 'runner_' + Math.floor(Math.random() * Date.now())

        return {
            folder: 'images/runner', // โฟลเดอร์ใน Cloudinary
            allowed_formats: ['jpg', 'png'], // กำหนดประเภทไฟล์
            public_id: newFileName
        }
    },
});

//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadRunner = multer({
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
}).single('runnerImage');

//สร้างฟังก์ชัน Create/Insert เพื่อเพิ่มข้อมูลลงตารางในฐานข้อมูล----------------
exports.createRunner = async (req, res) => {
    try {
        //เอาข้อมูลที่ส่งมาจาก client/user เพิ่มลงตารางในฐานข้อมูล
        const result = await prisma.runner_tb.create({ //.create คือ การเพิ่ม
            data: {
                runnerName: req.body.runnerName,
                runnerUsername: req.body.runnerUsername,
                runnerPassword: req.body.runnerPassword,
                // runnerImage: req.file ? req.file.path.replace("images\\runner\\", "") : ""
                runnerImage: req.file ? req.file.path : ""
            }
        });

        //ส่งผลการทำงานกลับไปยัง client/user
        res.status(201).json({
            message: 'Insert data successfully',
            data: result
        });
    } catch (err) {
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}

//สร้างฟังก์ชันตรวจสอบชื่อผู้ใช้รหัสผ่าน -----------
exports.checkLoginRunner = async (req, res) => {
    try {
        const result = await prisma.runner_tb.findFirst({ //.create คือ การเพิ่ม
            where: {
                runnerUsername: req.params.runnerUsername,
                runnerPassword: req.params.runnerPassword,
            }
        });

        //ส่งผลการทำงานกลับไปยัง client/user
        if (result) {
            res.status(200).json({
                message: 'username and password is correct',
                data: result
            });
        } else {
            res.status(404).json({
                message: 'username and password is in-correct',
                data: result
            });
        }
    } catch (err) {
        res.status(500).json({ message: `ERROR:  ${err}` });
    }
}
