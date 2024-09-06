const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateCreateUser } = require('../controllers/userController'); // Import controller
const upload = require('../middleware/upload');

// Mendapatkan semua rumah
router.get('/', userController.getAllUser);

// Mendatakan rumah berdasarkan ID
router.get('/:id', userController.getUserById);

// Menambahkan rumah baru
router.post('/', upload.single('image') , validateCreateUser, userController.createUser);

// // Mengedit rumah
router.put('/:id', upload.single('image') , userController.editUser);

// // Menghapus rumah
router.delete('/:id', userController.deleteUser);

module.exports = router;
