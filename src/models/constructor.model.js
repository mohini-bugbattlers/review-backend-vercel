const mongoose = require('mongoose');

const constructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  imageUrl: String,
  suspended: { type: Boolean, default: false },
  contactInfo: {
    email: String,
    phone: String,
    website: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Constructor', constructorSchema);
