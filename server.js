const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
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

// ✅ CORS Ayarları
const corsOptions = {
  origin: "https://lavie-frontend.netlify.app", // Frontend URL
  credentials: true, // Eğer cookie veya header gönderiyorsan bunu da aç
};

// middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(cors(corsOptions)); // ✔️ CORS ayarını burada tanımlıyoruz

// ✔️ Preflight istekleri için garanti
app.options('*', cors(corsOptions));

app.use("/api", mainRoute);

app.listen(port, () => {
  connect();
  console.log(`🚀 Sunucu ${port} portunda çalışıyor.`);
});
