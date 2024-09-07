const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
require("dotenv").config();

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validasi apakah email dan password dikirim dalam request body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Gunakan where clause dengan Sequelize untuk mencari user berdasarkan email
        const user = await User.findOne({
            where: { email } // Mencari user dengan email yang cocok
        });

        // Jika user tidak ditemukan, kirimkan respons error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cek apakah password ada di database
        if (!user.password) {
            return res.status(500).json({ message: "User password is missing in database" });
        }

        // Bandingkan password input dengan password yang di-hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Jika login berhasil, buat token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Kirimkan respons sukses dengan token
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
