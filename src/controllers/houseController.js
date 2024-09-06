const { response } = require("express");
const { House } = require("../models"); // Model House
const { body, validationResult } = require("express-validator");
const fs = require("fs").promises;
const path = require("path");

exports.validateCreateHouse = [
  body("name").notEmpty().withMessage("Name is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("price").notEmpty().withMessage("Price is required"),
];

// Mendapatkan semua rumah
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll();
    res.json({
      success: true,
      message: "Houses fetched successfully",
      data: houses,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching houses" });
  }
};

exports.getHouseById = async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findByPk(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    res.json({
      success: true,
      message: "House fetched successfully",
      data: house,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching house" });
  }
};

// Menambahkan rumah baru
exports.createHouse = async (req, res) => {
  const { name, location, price, image, description, created_by } = req.body;
  const file = image ? image.filename : null;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newHouse = await House.create({
      name,
      location,
      price,
      image,
      description,
      created_by,
    });
    res.status(201).json({
      success: true,
      message: "House created successfully",
      data: newHouse,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.editHouse = async (req, res) => {
  const { name, location, price, description, created_by } = req.body;
  const { id } = req.params;
  const newImage = req.file ? req.file.filename : null;

  try {
    const house = await House.findByPk(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Jika ada gambar baru, hapus gambar lama
    if (newImage && house.image) {
      const oldImagePath = path.join(__dirname, "../uploads", house.image);
      console.log("Old image path:", oldImagePath); // Debugging

      try {
        await fs.unlink(oldImagePath);
        console.log("Old image deleted successfully");
      } catch (err) {
        console.error("Error deleting old image:", err.message);
        return res.status(500).json({ error: "Error deleting old image" });
      }
    }

    // Update data rumah
    house.name = name;
    house.location = location;
    house.price = price;
    house.description = description;
    house.created_by = created_by;

    if (newImage) {
      house.image = newImage;
    }

    await house.save();
    res.json({
      message: "House updated successfully",
      data: house,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHouse = async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findByPk(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Jika ada gambar, hapus gambar
    if (house.image) {
      const imagePath = path.join(__dirname, "../uploads", house.image);
      console.log("Image path:", imagePath); // Debugging

      try {
        await fs.unlink(imagePath);
        console.log("Image deleted successfully");
      } catch (err) {
        console.error("Error deleting image:", err.message);
        return res.status(500).json({ error: "Error deleting image" });
      }
    }
    await house.destroy();
    res.json({ message: "House deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
