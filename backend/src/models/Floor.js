const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: { type: Number, required: true, unique: true },
  name:        { type: String, required: true },
  shortName:   { type: String, required: true },
  width:       { type: Number, required: true },   // SVG coordinate width
  height:      { type: Number, required: true },   // SVG coordinate height
  areaSqft:    { type: Number },
  areaSqm:     { type: Number },
  mapImageUrl: { type: String, default: '' },       // Blueprint image path
}, { timestamps: true });

module.exports = mongoose.model('Floor', floorSchema);
