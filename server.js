require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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

// ===== HEALTH CHECK (ПЕРВЫЙ МАРШРУТ) =====
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/test", (req, res) => {
  res.json({
    status: 'ok',
    message: 'Бэкенд работает!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ===== МАРШРУТЫ =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "🚀 API работает!",
    endpoints: {
      health: "/health",
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

// Ошибки
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  res.status(500).json({ error: err.message });
});

// ===== ЗАПУСК =====
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Health check: /health`);
    console.log(`✅ Готов к работе!`);
  });
}).catch((err) => {
  console.error("❌ Ошибка запуска:", err);
});