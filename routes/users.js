const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/telegram - авторизация через Telegram
router.post('/telegram', async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;
    
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      user = new User({
        telegramId,
        username: username || '',
        firstName: firstName || '',
        lastName: lastName || '',
      });
      await user.save();
    }
    
    user.lastLogin = new Date();
    await user.save();
    
    const token = Buffer.from(`${telegramId}:${Date.now()}`).toString('base64');
    
    res.json({
      user,
      token,
      isAdmin: user.role === 'admin',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/profile - получить профиль текущего пользователя
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    const decoded = Buffer.from(token, 'base64').toString();
    const [telegramId] = decoded.split(':');
    
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /api/users - получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id - получить одного пользователя
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/users/:id/role - обновить роль пользователя
router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;