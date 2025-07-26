const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

exports.generateToken = (payload) => jwt.sign(payload, secret, { expiresIn: '1d' });
exports.verifyToken = (token) => jwt.verify(token, secret);