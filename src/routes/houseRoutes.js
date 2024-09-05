const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController'); // Import controller

// Mendapatkan semua rumah
router.get('/', houseController.getAllHouses);

// Mendatakan rumah berdasarkan ID
router.get('/:id', houseController.getHouseById);

// Menambahkan rumah baru
router.post('/', houseController.createHouse);

// Mengedit rumah
router.put('/:id', houseController.editHouse);

// Menghapus rumah
router.delete('/:id', houseController.deleteHouse);

module.exports = router;
