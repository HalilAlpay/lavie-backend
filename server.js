const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mainRoute = require("./routes/index.js");

dotenv.config();
const port = process.env.PORT || 5000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to mongoDb");
  } catch (error) {
    throw error;
  }
};

// Render gibi platformlar için trust proxy ayarı
app.set('trust proxy', 1);

// ✅ CORS Ayarları
const corsOptions = {
  origin: process.env.CLIENT_DOMAIN || "https://lavie-frontend.netlify.app",
  credentials: true,
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum 100 istek
  message: 'Too many requests from this IP, please try again later.'
});

// Security middlewares
app.use(helmet());
app.use(limiter);

// middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cors(corsOptions));

// ✔️ Preflight istekleri için garanti
app.options('*', cors(corsOptions));

app.use("/api", mainRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sadece production'da server'ı başlat
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    connect();
    console.log(`🚀 Sunucu ${port} portunda çalışıyor.`);
  });
}

module.exports = app;
