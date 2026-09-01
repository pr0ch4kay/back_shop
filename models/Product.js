const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название обязательно'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Бренд обязателен'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['снюс', 'подушки', 'жидкости', 'вейпы', 'одноразки'],
    default: 'снюс',
  },
  price: {
    type: Number,
    required: [true, 'Цена обязательна'],
    min: 0,
  },
  nicotine: {
    type: Number,
    default: 0,
    min: 0,
    max: 150,
  },
  flavor: {
    type: String,
    default: '',
  },
  weight: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);