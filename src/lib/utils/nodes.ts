import type { NodeType } from '$lib/types/store.js';

// get node x, y with node id from nodesStore
export function getNodePosition(id: string, nodes: NodeType[]) {
    const node = nodes.find(node => node.id === id);
    if (!node) return [0, 0];
    return [node.transform.x, node.transform.y];
}

// get node center x, y with node id from nodesStore
export function getNodeCenterPosition(id: string, nodes: NodeType[]) {
    const node = nodes.find(node => node.id === id);
    if (!node) return [0, 0];
    return [node.transform.x + node.transform.width / 2, node.transform.y + node.transform.height / 2];
}
