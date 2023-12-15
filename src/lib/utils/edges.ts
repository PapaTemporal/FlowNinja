import type { NodeType } from '$lib/types/index.js';
import type { EdgeType } from '$lib/types/store.js';
import { getNodeCenterPosition } from '$lib/utils/nodes.js';

export function getEdgeSourceAndTargetNodePositions(
    edge: EdgeType,
    nodes: NodeType[]
) {
    const sourceNode = getNodeCenterPosition(edge.source, nodes);
    const targetNode = getNodeCenterPosition(edge.target, nodes);
    return {
        sourceX: sourceNode[0],
        sourceY: sourceNode[1],
        targetX: targetNode[0],
        targetY: targetNode[1],
    };
}
