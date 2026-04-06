const express = require('express');
const router = express.Router();
const Floor = require('../models/Floor');
const Location = require('../models/Location');

// GET /api/floors
router.get('/', async (req, res, next) => {
  try {
    const floors = await Floor.find().sort({ floorNumber: 1 }).lean();
    res.json({ success: true, data: floors });
  } catch (err) {
    next(err);
  }
});

// GET /api/floors/:number — Floor with all its locations
router.get('/:number', async (req, res, next) => {
  try {
    const floorNum = Number(req.params.number);
    const floor = await Floor.findOne({ floorNumber: floorNum }).lean();
    if (!floor) {
      return res.status(404).json({ success: false, error: 'Floor not found' });
    }

    const locations = await Location.find({ floor: floorNum }).sort({ name: 1 }).lean();
    res.json({ success: true, data: { ...floor, locations } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
