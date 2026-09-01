require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Health check - ДО ВСЕГО
app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "API работает!" });
});

// Остальные маршруты
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/auth", require("./routes/auth.routes"));

app.get("/", (req, res) => {
  res.json({ message: "🚀 API работает!" });
});

// ===== ЗАПУСК =====
const PORT = process.env.PORT || 5000;

console.log("🔄 Запуск сервера...");

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`✅ Готов к работе!`);
    });
  })
  .catch(err => {
    console.error("❌ Ошибка:", err);
    // НЕ выходим из процесса, ждём перезапуск
  });