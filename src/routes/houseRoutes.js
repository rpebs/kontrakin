const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController'); // Import controller
const { validateCreateHouse } = require('../controllers/houseController'); // Import controller
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Mendapatkan semua rumah
router.get('/', houseController.getAllHouses);

// Mendatakan rumah berdasarkan ID
router.get('/:id', houseController.getHouseById);

// Menambahkan rumah baru
router.post('/', auth, upload.single('image') , validateCreateHouse, houseController.createHouse);

// Mengedit rumah
router.put('/:id', auth, upload.single('image') , validateCreateHouse, houseController.editHouse);

// Menghapus rumah
router.delete('/:id', auth, houseController.deleteHouse);

module.exports = router;
