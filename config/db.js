const mongoose = require('mongoose');
const dns = require('dns');

// Принудительно задаем DNS-серверы для решения проблем с Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // принудительно используем IPv4
      serverSelectionTimeoutMS: 5000, // таймаут 5 секунд
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
    console.log(`📊 База данных: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Ошибка подключения к MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;