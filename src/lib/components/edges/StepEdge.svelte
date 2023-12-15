<script lang="ts">
    import { getSmoothStepPath } from '$lib/utils/index.js';
    import type { EdgeType, NodeType } from '$lib/types/index.js';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';

    export let edge: EdgeType;

    const nodes: Writable<NodeType[]> = getContext('nodesStore');

    let sourceNode: NodeType;
    let targetNode: NodeType;
    let sourceX: number;
    let sourceY: number;
    let targetX: number;
    let targetY: number;

    $: {
        sourceNode = $nodes.find(node => node.id === edge.source) as NodeType;
        targetNode = $nodes.find(node => node.id === edge.target) as NodeType;

        if (sourceNode) {
            sourceX = sourceNode.transform.x + sourceNode.transform.width / 2;
            sourceY = sourceNode.transform.y + sourceNode.transform.height / 2;
        }

        if (targetNode) {
            targetX = targetNode.transform.x + targetNode.transform.width / 2;
            targetY = targetNode.transform.y + targetNode.transform.height / 2;
        }
    }

    $: [path, labelX, labelY] = getSmoothStepPath({
        sourceX: sourceX,
        sourceY: sourceY,
        targetX: targetX,
        targetY: targetY,
        sourceDirection: edge.sourceDirection,
        targetDirection: edge.targetDirection,
        borderRadius: 0,
    });
</script>

<path
    id={edge.id}
    d={path}
    marker-start={edge.markerStart}
    marker-end={edge.markerEnd}
    fill="none"
    style={edge.style}
    class="edge"
/>

<style>
    .edge {
        stroke: #b1b1b7;
        stroke-width: 2;
        fill: none;
    }
</style>
