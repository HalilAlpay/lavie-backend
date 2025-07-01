const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { validateUser } = require("../middleware/validation.js");

const generateRandomAvatar = () => {
  const randomAvatar = Math.floor(Math.random() * 71);
  return `https://i.pravatar.cc/300?img=${randomAvatar}`;
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Kullanıcı Oluşturma (Register)
router.post("/register", validateUser, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const defaultAvatar = generateRandomAvatar();

    // Daha önce kayıtlı mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email address is already registered." });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: defaultAvatar,
    });

    await newUser.save();

    // Token oluştur
    const token = generateToken(newUser._id);

    // ✅ Doğru formatta cevap dön
    res.status(201).json({
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar,
      role: newUser.role,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ Kullanıcı Girişi (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid email." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Token oluştur
    const token = generateToken(user._id);

    // ✅ Doğru formatta cevap dön
    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

// Kullanıcı profili getirme
router.get("/profile", async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
