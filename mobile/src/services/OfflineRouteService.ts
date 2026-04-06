// ═══════════════════════════════════════════
// Offline Route Service — Original Simple Dijkstra
// ═══════════════════════════════════════════
import { MapLocation, RouteResult, PathNode, NavigationStep } from '../types';

function buildGraph(locations: MapLocation[]) {
  const nodes = new Map<string, MapLocation>();
  locations.forEach(loc => nodes.set(loc.locationId, loc));

  const edges = new Map<string, { targetId: string; weight: number }[]>();
  const corridorTypes = ['corridor', 'stairs', 'entrance'];
  const corridors = locations.filter(l => corridorTypes.includes(l.type));
  const rooms = locations.filter(l => !corridorTypes.includes(l.type));

  locations.forEach(l => edges.set(l.locationId, []));

  for (let i = 0; i < corridors.length; i++) {
    for (let j = i + 1; j < corridors.length; j++) {
      const a = corridors[i];
      const b = corridors[j];
      if (a.floor !== b.floor) {
        if (a.type === 'stairs' && b.type === 'stairs' && Math.abs(a.floor - b.floor) === 1) {
          edges.get(a.locationId)!.push({ targetId: b.locationId, weight: 20 });
          edges.get(b.locationId)!.push({ targetId: a.locationId, weight: 20 });
        }
        continue;
      }
      const d = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
      if (d < 30) {
        edges.get(a.locationId)!.push({ targetId: b.locationId, weight: d });
        edges.get(b.locationId)!.push({ targetId: a.locationId, weight: d });
      }
    }
  }

  for (const room of rooms) {
    const sameFloorCorridors = corridors.filter(c => c.floor === room.floor);
    const sorted = sameFloorCorridors
      .map(c => ({ corridor: c, dist: Math.sqrt(Math.pow(room.x - c.x, 2) + Math.pow(room.y - c.y, 2)) }))
      .sort((a, b) => a.dist - b.dist);
    if (sorted.length > 0) {
      edges.get(room.locationId)!.push({ targetId: sorted[0].corridor.locationId, weight: sorted[0].dist });
      edges.get(sorted[0].corridor.locationId)!.push({ targetId: room.locationId, weight: sorted[0].dist });
    }
  }
  return { nodes, edges };
}

function dijkstra(start: string, end: string, nodes: Map<string, MapLocation>, edges: Map<string, { targetId: string; weight: number }[]>) {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  for (const id of nodes.keys()) { dist.set(id, Infinity); prev.set(id, null); }
  dist.set(start, 0);

  while (true) {
    let current: string | null = null;
    let minDist = Infinity;
    for (const [id, d] of dist.entries()) { if (!visited.has(id) && d < minDist) { minDist = d; current = id; } }
    if (current === null || current === end) break;
    visited.add(current);
    const neighbors = edges.get(current) || [];
    for (const { targetId, weight } of neighbors) {
      if (visited.has(targetId)) continue;
      const newDist = (dist.get(current) || 0) + weight;
      if (newDist < (dist.get(targetId) || Infinity)) { dist.set(targetId, newDist); prev.set(targetId, current); }
    }
  }
  if (!dist.has(end) || dist.get(end) === Infinity) return null;
  const path: string[] = [];
  let node: string | null = end;
  while (node) { path.unshift(node); node = prev.get(node) || null; }
  return path;
}

export function calculateOfflineRoute(from: MapLocation, to: MapLocation, allLocations: MapLocation[]): RouteResult | null {
  const { nodes, edges } = buildGraph(allLocations);
  const pathIds = dijkstra(from.locationId, to.locationId, nodes, edges);
  if (!pathIds) return null;

  const pathNodes: PathNode[] = pathIds.map(id => {
    const loc = nodes.get(id)!;
    return { locationId: loc.locationId, name: loc.name, label: loc.label || loc.name, floor: loc.floor, x: loc.x, y: loc.y, type: loc.type };
  });

  const steps: NavigationStep[] = [];
  let totalDist = 0;

  for (let i = 0; i < pathNodes.length; i++) {
    const curr = pathNodes[i];
    const prev = i > 0 ? pathNodes[i - 1] : null;
    const next = i < pathNodes.length - 1 ? pathNodes[i + 1] : null;

    let stepDist = 0;
    if (next) {
      stepDist = Math.round(Math.sqrt(Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2)) * 0.5);
      totalDist += stepDist;
    }

    let type: NavigationStep['type'] = 'walk';
    let icon = 'arrow-up';
    let text = 'Go straight';

    if (i === 0) {
      type = 'start';
      icon = 'account-marker';
      text = `Start at ${curr.label}`;
    } else if (i === pathNodes.length - 1) {
      type = 'arrive';
      icon = 'check-circle';
      text = `Arrive at ${curr.label}`;
      stepDist = 0;
    } else if (prev && next) {
      // Basic turn detection using cross product
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      const cross = v1.x * v2.y - v1.y * v2.x;
      const dot = v1.x * v2.x + v1.y * v2.y;
      const angle = Math.atan2(cross, dot) * (180 / Math.PI);

      if (angle > 30) {
        type = 'turn';
        icon = 'arrow-right-top';
        text = 'Turn right';
      } else if (angle < -30) {
        type = 'turn';
        icon = 'arrow-left-top';
        text = 'Turn left';
      } else if (curr.type === 'stairs' || curr.type === 'lift') {
        type = 'floor_change';
        icon = curr.type === 'lift' ? 'elevator' : 'stairs';
        text = `Take ${curr.type === 'lift' ? 'lift' : 'stairs'} to Floor ${next.floor}`;
      }
    }

    steps.push({
      type, icon, text, floor: curr.floor, locationId: curr.locationId,
      x: curr.x, y: curr.y, distance: stepDist
    });
  }

  return {
    path: pathNodes, 
    distance: totalDist, 
    estimatedTime: Math.ceil(totalDist * 0.5),
    steps,
    fromFloor: from.floor, 
    toFloor: to.floor, 
    isMultiFloor: from.floor !== to.floor
  };
}
