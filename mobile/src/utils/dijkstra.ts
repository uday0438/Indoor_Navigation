// ═══════════════════════════════════════════
// Client-side Dijkstra shortest path
// ═══════════════════════════════════════════
import { GraphData, PathNode } from '../types';

class MinHeap {
  private items: { node: string; cost: number }[] = [];

  push(node: string, cost: number) {
    this.items.push({ node, cost });
    this.items.sort((a, b) => a.cost - b.cost);
  }

  pop() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export function dijkstra(
  graph: GraphData,
  startId: string,
  endId: string,
  avoidStairs = false
): { path: PathNode[]; distance: number } | null {
  const adj: Record<string, { to: string; weight: number }[]> = {};

  for (const id of Object.keys(graph.nodes)) {
    adj[id] = [];
  }
  for (const edge of graph.edges) {
    if (adj[edge.from]) adj[edge.from].push({ to: edge.to, weight: edge.weight });
    if (adj[edge.to]) adj[edge.to].push({ to: edge.from, weight: edge.weight });
  }

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const heap = new MinHeap();

  for (const id of Object.keys(graph.nodes)) {
    dist[id] = Infinity;
    prev[id] = null;
  }

  dist[startId] = 0;
  heap.push(startId, 0);

  while (!heap.isEmpty()) {
    const item = heap.pop()!;
    const { node: current } = item;

    if (visited.has(current)) continue;
    visited.add(current);
    if (current === endId) break;

    for (const neighbor of adj[current] || []) {
      if (visited.has(neighbor.to)) continue;
      if (avoidStairs && graph.nodes[neighbor.to]?.type === 'stairs') continue;

      const newDist = dist[current] + neighbor.weight;
      if (newDist < dist[neighbor.to]) {
        dist[neighbor.to] = newDist;
        prev[neighbor.to] = current;
        heap.push(neighbor.to, newDist);
      }
    }
  }

  if (dist[endId] === Infinity) return null;

  const path: PathNode[] = [];
  let cur: string | null = endId;
  while (cur) {
    path.unshift(graph.nodes[cur]);
    cur = prev[cur];
  }

  return { path, distance: Math.round(dist[endId] * 100) / 100 };
}
