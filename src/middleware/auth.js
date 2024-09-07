require('dotenv').config(); // Menggunakan dotenv untuk mendapatkan JWT_SECRET
const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token JWT
const auth = (req, res, next) => {
    // Mengambil token dari header Authorization
    const token = req.header('Authorization');
    
    // Jika token tidak ada, kirim respons 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Menghapus kata 'Bearer ' dari token (jika ada)
        const tokenWithoutBearer = token.replace('Bearer ', '');
        
        // Verifikasi token menggunakan secret key
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        
        // Menyimpan data user di req.user untuk diakses di route selanjutnya
        req.user = decoded;
        
        // Lanjut ke route berikutnya jika token valid
        next();
    } catch (error) {
        // Jika token tidak valid atau terjadi kesalahan, kirim respons 400 (Bad Request)
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;
