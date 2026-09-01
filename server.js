require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

// ✅ Тестовый маршрут для проверки
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "Бэкенд работает!" });
});

app.get("/", (req, res) => {
  res.json({ message: "API работает!" });
});

const start = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB подключена");

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });

    // ✅ Обработка SIGTERM (Railway отправляет этот сигнал)
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