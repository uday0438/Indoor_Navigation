/**
 * Graph Utilities — Dijkstra shortest path for indoor navigation
 * Supports multi-floor routing via stairs/lift nodes
 */

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

/**
 * Build adjacency map from Location documents
 * @param {Array} locations - Array of Location documents
 * @returns {Map} adjacency map: locationId → [{ targetId, weight }]
 */
function buildAdjacencyMap(locations) {
  const adj = new Map();
  for (const loc of locations) {
    adj.set(loc.locationId, {
      ...loc,
      neighbors: loc.adjacency || [],
    });
  }
  return adj;
}

/**
 * Dijkstra's shortest path
 * @param {Map} adjacencyMap
 * @param {string} startId
 * @param {string} endId
 * @param {Object} options - { avoidStairs: bool }
 * @returns {{ path: string[], distance: number, steps: Object[] } | null}
 */
function dijkstra(adjacencyMap, startId, endId, options = {}) {
  const ROOM_TRAVERSAL_PENALTY = 200; // Heavy penalty to avoid routing THROUGH rooms
  const { avoidStairs = false } = options;

  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const pq = new PriorityQueue();

  for (const [id] of adjacencyMap) {
    dist.set(id, Infinity);
  }
  dist.set(startId, 0);
  pq.enqueue(startId, 0);

  while (!pq.isEmpty()) {
    const { element: currentId } = pq.dequeue();

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    if (currentId === endId) break;

    const current = adjacencyMap.get(currentId);
    if (!current) continue;

    for (const { targetId, weight } of current.neighbors) {
      if (visited.has(targetId)) continue;

      const target = adjacencyMap.get(targetId);
      if (!target) continue;

      // Skip stairs if user wants to avoid them
      if (avoidStairs && target.type === 'stairs') continue;

      // Penalize routing through rooms — force paths through corridors
      // Only the start and end nodes are allowed to be rooms without penalty
      let penalty = 0;
      if (
        target.type !== 'corridor' &&
        target.type !== 'stairs' &&
        target.type !== 'entrance' &&
        targetId !== startId &&
        targetId !== endId
      ) {
        penalty = ROOM_TRAVERSAL_PENALTY;
      }

      const newDist = dist.get(currentId) + weight + penalty;
      if (newDist < dist.get(targetId)) {
        dist.set(targetId, newDist);
        prev.set(targetId, currentId);
        pq.enqueue(targetId, newDist);
      }
    }
  }

  // No path found
  if (dist.get(endId) === Infinity) return null;

  // Reconstruct path
  const path = [];
  let current = endId;
  while (current) {
    path.unshift(current);
    current = prev.get(current);
  }

  // Generate navigation steps
  const steps = generateSteps(path, adjacencyMap);

  return {
    path,
    distance: Math.round(dist.get(endId) * 100) / 100,
    estimatedTime: Math.ceil(dist.get(endId) * 1.2), // ~1.2 sec per meter at walking speed
    steps,
  };
}

/**
 * Generate human-readable navigation steps from a path
 */
function generateSteps(path, adjacencyMap) {
  const steps = [];
  let prevFloor = null;

  for (let i = 0; i < path.length; i++) {
    const node = adjacencyMap.get(path[i]);
    if (!node) continue;

    const floor = node.floor;

    if (i === 0) {
      steps.push({
        type: 'start',
        icon: '📍',
        text: `Start at ${node.label || node.name}`,
        floor,
        locationId: path[i],
        x: node.x,
        y: node.y,
      });

      // If starting from a room, add "exit to corridor" step
      if (node.type !== 'corridor' && node.type !== 'stairs' && node.type !== 'entrance') {
        const nextNode = adjacencyMap.get(path[1]);
        if (nextNode && (nextNode.type === 'corridor' || nextNode.type === 'entrance')) {
          steps.push({
            type: 'walk',
            icon: '🚪',
            text: `Exit room to corridor`,
            floor,
            locationId: path[1],
            x: nextNode.x,
            y: nextNode.y,
          });
        }
      }
      prevFloor = floor;
      continue;
    }

    // Floor change
    if (floor !== prevFloor) {
      const direction = floor > prevFloor ? 'up' : 'down';
      steps.push({
        type: 'floor_change',
        icon: direction === 'up' ? '⬆️' : '⬇️',
        text: `Take stairs ${direction} to Floor ${floor}`,
        floor,
        locationId: path[i],
        x: node.x,
        y: node.y,
      });
      prevFloor = floor;
      continue;
    }

    // Turn detection
    if (i > 0 && i < path.length - 1) {
      const prev = adjacencyMap.get(path[i - 1]);
      const next = adjacencyMap.get(path[i + 1]);

      if (prev && next && prev.floor === floor && next.floor === floor) {
        const dx1 = node.x - prev.x;
        const dy1 = node.y - prev.y;
        const dx2 = next.x - node.x;
        const dy2 = next.y - node.y;

        const cross = dx1 * dy2 - dy1 * dx2;
        const angle = Math.abs(cross);

        if (angle > 15) {
          steps.push({
            type: 'turn',
            icon: cross > 0 ? '↪️' : '↩️',
            text: cross > 0 ? 'Turn right' : 'Turn left',
            floor,
            locationId: path[i],
            x: node.x,
            y: node.y,
          });
        }
      }
    }

    // Corridor walk — calculate distance
    if (node.type === 'corridor' && i > 0) {
      const prev = adjacencyMap.get(path[i - 1]);
      if (prev) {
        const dx = node.x - prev.x;
        const dy = node.y - prev.y;
        const dist = Math.round(Math.sqrt(dx * dx + dy * dy));
        if (dist > 3) {
          steps.push({
            type: 'walk',
            icon: '🚶',
            text: `Walk straight ~${dist}m`,
            floor,
            locationId: path[i],
            x: node.x,
            y: node.y,
          });
        }
      }
    }

    // Destination
    if (i === path.length - 1) {
      // If destination is a room, add "enter room" step
      if (node.type !== 'corridor' && node.type !== 'stairs' && node.type !== 'entrance') {
        steps.push({
          type: 'walk',
          icon: '🚪',
          text: `Enter ${node.label || node.name}`,
          floor,
          locationId: path[i],
          x: node.x,
          y: node.y,
        });
      }
      steps.push({
        type: 'arrive',
        icon: '🏁',
        text: `Arrive at ${node.label || node.name}`,
        floor,
        locationId: path[i],
        x: node.x,
        y: node.y,
      });
    }
  }

  // Ensure we always have an arrival step
  if (steps.length > 0 && steps[steps.length - 1].type !== 'arrive') {
    const lastNode = adjacencyMap.get(path[path.length - 1]);
    if (lastNode) {
      steps.push({
        type: 'arrive',
        icon: '🏁',
        text: `Arrive at ${lastNode.label || lastNode.name}`,
        floor: lastNode.floor,
        locationId: path[path.length - 1],
        x: lastNode.x,
        y: lastNode.y,
      });
    }
  }

  return steps;
}

module.exports = { buildAdjacencyMap, dijkstra, generateSteps };
