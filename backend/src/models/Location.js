const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true, index: true },
  name:       { type: String, required: true },
  floor:      { type: Number, required: true, index: true },
  x:          { type: Number, required: true },
  y:          { type: Number, required: true },
  type: {
    type: String,
    enum: ['room', 'lab', 'office', 'classroom', 'corridor', 'stairs', 'lift', 'auditorium', 'library', 'washroom', 'store', 'entrance'],
    required: true,
  },
  label:       { type: String, default: '' },      // Display label (e.g. "Principal Office")
  description: { type: String, default: '' },
  adjacency: [{                                     // Graph edges
    targetId: { type: String, required: true },     // locationId of connected node
    weight:   { type: Number, required: true },     // distance in meters
  }],
  isNavigable: { type: Boolean, default: true },    // Can user walk here?
  metadata: {
    roomNumber: String,
    department: String,
    capacity:   Number,
  },
}, { timestamps: true });

locationSchema.index({ floor: 1, type: 1 });

module.exports = mongoose.model('Location', locationSchema);
