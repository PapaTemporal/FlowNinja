import type { NodeType } from "$lib/types/store.js";

// get node x, y with node id from nodesStore
export function getNodePosition(id: string, nodes: NodeType[]) {
    const node = nodes.find((node) => node.id === id);
    if (!node) return [0, 0];
    return [node.x, node.y];
}

// get node center x, y with node id from nodesStore
export function getNodeCenterPosition(id: string, nodes: NodeType[]) {
    const node = nodes.find((node) => node.id === id);
    if (!node) return [0, 0];
    return [node.x + node.width / 2, node.y + node.height / 2];
}