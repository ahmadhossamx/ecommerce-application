const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: '7d' }
  );
}

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return next();
}

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email })) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const user = await User.create({ name, email, password });
      return res.status(201).json({
        token: signToken(user),
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.json({
        token: signToken(user),
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
