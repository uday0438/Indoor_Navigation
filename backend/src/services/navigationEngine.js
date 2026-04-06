const Location = require('../models/Location');
const { buildAdjacencyMap, dijkstra } = require('../utils/graphUtils');

let cachedGraph = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Load and cache the navigation graph from MongoDB
 */
async function getGraph() {
  const now = Date.now();
  if (cachedGraph && now - cacheTimestamp < CACHE_TTL) {
    return cachedGraph;
  }

  const locations = await Location.find({ isNavigable: true }).lean();
  cachedGraph = buildAdjacencyMap(locations);
  cacheTimestamp = now;
  return cachedGraph;
}

/**
 * Invalidate graph cache (call after data changes)
 */
function invalidateGraphCache() {
  cachedGraph = null;
  cacheTimestamp = 0;
}

/**
 * Calculate route between two locations
 * @param {string} fromId
 * @param {string} toId
 * @param {Object} options
 */
async function calculateRoute(fromId, toId, options = {}) {
  const graph = await getGraph();

  if (!graph.has(fromId)) {
    throw new Error(`Start location '${fromId}' not found in navigation graph`);
  }
  if (!graph.has(toId)) {
    throw new Error(`Destination '${toId}' not found in navigation graph`);
  }

  const result = dijkstra(graph, fromId, toId, options);

  if (!result) {
    throw new Error(`No navigable path from '${fromId}' to '${toId}'`);
  }

  // Enrich path with full coordinate data
  const pathWithCoords = result.path.map((id) => {
    const node = graph.get(id);
    return {
      locationId: id,
      name: node.name,
      label: node.label || node.name,
      floor: node.floor,
      x: node.x,
      y: node.y,
      type: node.type,
    };
  });

  return {
    path: pathWithCoords,
    distance: result.distance,
    estimatedTime: result.estimatedTime,
    steps: result.steps,
    fromFloor: pathWithCoords[0].floor,
    toFloor: pathWithCoords[pathWithCoords.length - 1].floor,
    isMultiFloor: pathWithCoords[0].floor !== pathWithCoords[pathWithCoords.length - 1].floor,
  };
}

/**
 * Check if user is off-route and recalculate
 * @param {Object} userPos - { x, y, floor }
 * @param {Array} currentPath - Array of path nodes
 * @param {string} destinationId
 * @param {number} threshold - meters
 */
async function checkAndRecalculate(userPos, currentPath, destinationId, threshold = 8) {
  // Find closest node on current path
  let minDist = Infinity;
  let closestIdx = 0;

  for (let i = 0; i < currentPath.length; i++) {
    const node = currentPath[i];
    if (node.floor !== userPos.floor) continue;
    const dx = node.x - userPos.x;
    const dy = node.y - userPos.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < minDist) {
      minDist = d;
      closestIdx = i;
    }
  }

  // If too far from path, recalculate
  if (minDist > threshold) {
    // Find nearest graph node to user
    const graph = await getGraph();
    let nearestId = null;
    let nearestDist = Infinity;

    for (const [id, node] of graph) {
      if (node.floor !== userPos.floor) continue;
      const dx = node.x - userPos.x;
      const dy = node.y - userPos.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < nearestDist) {
        nearestDist = d;
        nearestId = id;
      }
    }

    if (nearestId) {
      return calculateRoute(nearestId, destinationId);
    }
  }

  // Still on route — return remaining path
  return {
    onRoute: true,
    remainingPath: currentPath.slice(closestIdx),
    completedPercent: Math.round((closestIdx / (currentPath.length - 1)) * 100),
  };
}

module.exports = {
  calculateRoute,
  checkAndRecalculate,
  getGraph,
  invalidateGraphCache,
};
