const express = require('express');
const { sequelize } = require('./models'); // Mengambil Sequelize instance dari model
const houseRoutes = require('./routes/houseRoutes'); // Import rute rumah
const userRoutes = require('./routes/userRoutes'); // Import rute rumah
const path = require('path');


const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Gunakan rute untuk rumah
app.use('/api/houses', houseRoutes);

// Gunakan rute untuk user
app.use('/api/users', userRoutes);

// Sinkronisasi database sebelum menjalankan server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Tidak dapat terhubung ke database:', err);
});
