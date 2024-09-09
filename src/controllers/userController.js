const { response } = require("express");
const { User } = require("../models"); // Model House
const { body, validationResult } = require("express-validator");
const fs = require('fs').promises
const path = require('path')
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.validateCreateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("email").notEmpty().isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  body("phone").isNumeric().withMessage("Phone number must be numeric"),
  body("gender").notEmpty().withMessage("Gender is required")
];

// Mendapatkan semua rumah
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching houses" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(
        {
            success: true,
            message: "User fetched successfully",
            data: house
        }
    );
  } catch (error) {
    res.status(500).json({ error: "Error fetching house" });
  }
}

// Menambahkan rumah baru
exports.createUser = async (req, res) => {
  const { name, email, password, address, image } = req.body;
  const file = req.file ? req.file.filename : null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const pass = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      address,
      email,
      password : pass,
      image: file,
      phone: req.body.phone,
      gender: req.body.gender,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.editUser = async (req, res) => {
  const { name, email, password, address, image } = req.body;
  const { id } = req.params;
  const newImage = req.file ? req.file.filename : null;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Jika ada gambar baru, hapus gambar lama
    if (newImage && user.image) {
      const oldImagePath = path.join(__dirname, '../uploads', user.image);
      console.log("Old image path:", oldImagePath); // Debugging

      try {
        await fs.unlink(oldImagePath);
        console.log("Old image deleted successfully");
      } catch (err) {
        console.error("Error deleting old image:", err.message);
        return res.status(500).json({ error: "Error deleting old image" });
      }
    }

    // Update data user
    user.name = name;
    user.address = address;
    user.email = email;
    user.password = password;
    user.image = newImage;
    user.phone = req.body.phone;
    user.gender = req.body.gender;  

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await user.destroy();

    if (user.image) {
      const oldImagePath = path.join(__dirname, '../uploads', user.image);
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
        return res.status(500).json({ error: "Error deleting old image" });
      }
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
