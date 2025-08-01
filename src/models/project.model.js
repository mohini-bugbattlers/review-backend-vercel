const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  constructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Constructor', required: true },
  location: { type: String, required: true },
  images: [String],
  startDate: Date,
  completionDate: Date,
  status: { 
    type: String, 
    enum: ['ongoing', 'completed', 'planned'],
    default: 'planned'
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
