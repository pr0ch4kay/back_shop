require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const statsRoutes = require("./routes/stats");

const app = express();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));

app.use(express.json());

// Логирование
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Тестовый маршрут
app.get("/api/test", (req, res) => {
  res.json({
    status: 'ok',
    message: 'Бэкенд работает!',
    timestamp: new Date().toISOString()
  });
});

// Маршруты
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "🚀 API работает!",
    endpoints: {
      test: "/api/test",
      products: "/api/products",
      orders: "/api/orders",
      auth: "/api/auth",
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.url} не найден` });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  res.status(500).json({ error: err.message });
});

// ===== ЗАПУСК =====
const start = async () => {
  try {
    console.log('🔄 Запуск сервера...');
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 API доступен: http://localhost:${PORT}`);
    });
    
    // ✅ Настройки для Railway
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    
    // ✅ Обработка завершения
    process.on('SIGTERM', () => {
      console.log('🛑 Получен SIGTERM, завершаем работу...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🛑 Получен SIGINT, завершаем работу...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });
    
  } catch (err) {
    console.error("❌ Ошибка запуска:", err);
    process.exit(1);
  }
};

start();