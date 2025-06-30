const mongoose = require("mongoose");

const CouponSchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Kupon kodu
    discountPercent: { type: Number, required: true, min: 0, max: 100 }, // İndirim oranı
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", CouponSchema);
module.exports = Coupon;
