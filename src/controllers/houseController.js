const { House } = require("../models"); // Model House
const { body, validationResult } = require("express-validator");

// Mendapatkan semua rumah
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll();
    res.json(houses);
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
    res.json(
        {
            success: true,
            message: "House fetched successfully",
            data: house
        }
    );
  } catch (error) {
    res.status(500).json({ error: "Error fetching house" });
  }
}

// Menambahkan rumah baru
exports.createHouse = async (req, res) => {
  const { name, location, price, image, description } = req.body;
  body("name").notEmpty().withMessage("Name is required");
  body("location").notEmpty().withMessage("Location is required");
  body("price").notEmpty().withMessage("Price is required");

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
  const { name, location, price, image, description } = req.body;
  const { id } = req.params;
  try {
    const house = await House.findByPk(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    house.name = name;
    house.location = location;
    house.price = price;
    house.image = image;
    house.description = description;
    await house.save();
    res.json({ message: "House updated successfully", data: house });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

exports.deleteHouse = async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findByPk(id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    await house.destroy();
    res.json({ message: "House deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
