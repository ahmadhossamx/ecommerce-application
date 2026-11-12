const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('items are required'),
    body('items.*.product').notEmpty(),
    body('items.*.qty').isInt({ min: 1 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { items, shippingAddress } = req.body;
      let total = 0;
      const orderItems = [];
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
        if (product.stock < item.qty) {
          return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
        product.stock -= item.qty;
        await product.save();
        total += product.price * item.qty;
        orderItems.push({ product: product._id, qty: item.qty, price: product.price });
      }
      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        total,
        shippingAddress,
      });
      return res.status(201).json(order);
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/mine', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

router.get('/', protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
