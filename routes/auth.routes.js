const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// ===== POST /api/auth/login - вход в админку =====
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    // Проверяем логин и пароль
    if (login !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Неверный логин или пароль'
      });
    }

    // Ищем админа в БД
    let admin = await User.findOne({ role: 'admin' });

    // Если админа нет - создаём
    if (!admin) {
      admin = new User({
        telegramId: 'admin_' + Date.now(),
        username: 'admin',
        firstName: 'Администратор',
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Создан новый администратор');
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
        username: admin.username,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        firstName: admin.firstName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера'
    });
  }
});

// ===== GET /api/auth/verify - проверка токена =====
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Токен не найден'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Доступ запрещён'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Недействительный токен'
    });
  }
});

// ===== POST /api/auth/logout - выход =====
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

module.exports = router;