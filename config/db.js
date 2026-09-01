const mongoose = require('mongoose');
const dns = require('dns');

// Фикс для DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    console.log('📡 Подключение к MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
    console.log(`📊 База данных: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Ошибка подключения: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;