const multer = require('multer');
const path = require('path');
const fs = require("fs");

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Folder untuk menyimpan gambar
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nama file yang unik
  }
});

// Filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

// Middleware multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Maksimum 2MB
  fileFilter: fileFilter
});


module.exports = upload;
