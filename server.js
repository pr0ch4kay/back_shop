require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ ПОДКЛЮЧАЕМ db.js

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const statsRoutes = require("./routes/stats");

const app = express();

// Middleware
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use(express.json());

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
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      users: "/api/users",
      stats: "/api/stats",
    },
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error("❌ Ошибка:", err.message);
  res.status(500).json({ error: err.message });
});

const start = async () => {
  try {
    // ✅ Здесь вызывается connectDB() из db.js
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 API доступен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Ошибка запуска:", err);
    process.exit(1);
  }
};

start();