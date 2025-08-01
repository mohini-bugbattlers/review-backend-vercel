const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "customer", "builder"],
      default: "customer",
    },
    profileImage: String,
    phone: String,
    location: String,
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, // ✅ NEW FIELD
    otp: String,
    otpExpires: Date,
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "builder";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
