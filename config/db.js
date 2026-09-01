const mongoose = require("mongoose");
const dns = require("dns");

// ✅ Фикс для DNS на Railway
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI не найден в .env");
    }

    console.log('🔄 Подключение к MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
    console.log(`📊 База данных: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Ошибка подключения: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;