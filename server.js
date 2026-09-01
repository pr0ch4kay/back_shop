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

// Корневой маршрут
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
    console.log('🔄 Подключение к MongoDB...');
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 API доступен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Ошибка запуска:", err);
    process.exit(1);
  }
};

start();