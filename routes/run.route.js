 // จัดการเรื่องเส้นทางเพื่อกำหนด endpoint สำหรับ frontend ***
 // ในการเรียกใช้ controller เพื่อการทำงาน CRUD กับฐานข้อมูล และการอัปโหลดไฟล์
 
 // require package ที่ต้องใช้ในการกำหนดเส้นทาง (route)
 const express = require('express');
 
 // require controller เพื่อจะใช้งาน
 const runController = require('./../controllers/run.controller');
 
 // สร้าง router จาก express เพื่อจัดการเส้นทาง
 const router = express.Router();
 
 // กำหนดเส้นทาง และการเรียกใช้ controller
 // เพิ่ม
 router.post('/', runController.uploadRun, runController.createRun);
 //ค้นหา ตรวจสอบ ดึง ดู
 router.get('/:runnerId', runController.getAllRunOfRunner);
 router.get('/only/:runId', runController.getOneRunOfRunner);
 //ลบ
 router.delete('/:runId', runController.deleteRunOfRunner);
 //แก้ไข
 router.put('/:runId', runController.uploadRun, runController.updateRunOfRunner);

 // export router เพื่อนำไปใช้ที่ server.js
 module.exports = router;