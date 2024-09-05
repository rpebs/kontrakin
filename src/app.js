const express = require('express');
const { sequelize } = require('./models'); // Mengambil Sequelize instance dari model
const houseRoutes = require('./routes/houseRoutes'); // Import rute rumah

const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan rute untuk rumah
app.use('/api/houses', houseRoutes);

// Sinkronisasi database sebelum menjalankan server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Tidak dapat terhubung ke database:', err);
});
