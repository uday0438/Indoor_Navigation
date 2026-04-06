const express = require('express');
const router = express.Router();
const { calculateRoute, getGraph } = require('../services/navigationEngine');
const Location = require('../models/Location');

// POST /api/route — Calculate shortest path
router.post('/', async (req, res, next) => {
  try {
    const { fromId, toId, avoidStairs = false } = req.body;

    if (!fromId || !toId) {
      return res.status(400).json({
        success: false,
        error: 'fromId and toId are required',
      });
    }

    const result = await calculateRoute(fromId, toId, { avoidStairs });
    res.json({ success: true, data: result });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('No navigable')) {
      return res.status(404).json({ success: false, error: err.message });
    }
    next(err);
  }
});

// GET /api/graph — Full navigation graph (for client-side routing)
router.get('/graph', async (req, res, next) => {
  try {
    const locations = await Location.find({ isNavigable: true })
      .select('locationId name label floor x y type adjacency')
      .lean();

    // Build graph structure for client
    const nodes = {};
    const edges = [];

    for (const loc of locations) {
      nodes[loc.locationId] = {
        id: loc.locationId,
        name: loc.name,
        label: loc.label || loc.name,
        floor: loc.floor,
        x: loc.x,
        y: loc.y,
        type: loc.type,
      };

      for (const adj of (loc.adjacency || [])) {
        edges.push({
          from: loc.locationId,
          to: adj.targetId,
          weight: adj.weight,
        });
      }
    }

    res.json({
      success: true,
      data: { nodes, edges, nodeCount: Object.keys(nodes).length, edgeCount: edges.length },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
