const mongoose = require('mongoose');
const dns = require('dns');

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
    
    // ✅ Слушаем ошибки MongoDB
    mongoose.connection.on('error', (err) => {
      console.error('❌ Ошибка MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB отключена');
    });
    
    return conn;
  } catch (error) {
    console.error(`❌ Ошибка подключения: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;