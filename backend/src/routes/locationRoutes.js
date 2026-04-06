const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// GET /api/locations — All locations
router.get('/', async (req, res, next) => {
  try {
    const { floor, type } = req.query;
    const filter = {};
    if (floor !== undefined) filter.floor = Number(floor);
    if (type) filter.type = type;

    const locations = await Location.find(filter).sort({ floor: 1, name: 1 }).lean();
    res.json({ success: true, count: locations.length, data: locations });
  } catch (err) {
    next(err);
  }
});

// GET /api/locations/search?q=principal
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const locations = await Location.find({
      $or: [
        { name: regex },
        { label: regex },
        { locationId: regex },
        { 'metadata.roomNumber': regex },
      ],
    }).lean();
    res.json({ success: true, count: locations.length, data: locations });
  } catch (err) {
    next(err);
  }
});

// GET /api/locations/:id
router.get('/:id', async (req, res, next) => {
  try {
    const location = await Location.findOne({ locationId: req.params.id }).lean();
    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    res.json({ success: true, data: location });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
