const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/stats - получить статистику
router.get('/', async (req, res) => {
  try {
    const [products, orders, users] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      products: { total: products },
      orders: {
        totalOrders: orders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      users: { total: users },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;