const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController'); // Import controller
const { validateCreateHouse } = require('../controllers/houseController'); // Import controller
const upload = require('../middleware/upload');

// Mendapatkan semua rumah
router.get('/', houseController.getAllHouses);

// Mendatakan rumah berdasarkan ID
router.get('/:id', houseController.getHouseById);

// Menambahkan rumah baru
router.post('/', upload.single('image') , validateCreateHouse, houseController.createHouse);

// Mengedit rumah
router.put('/:id', upload.single('image') , validateCreateHouse, houseController.editHouse);

// Menghapus rumah
router.delete('/:id', houseController.deleteHouse);

module.exports = router;
