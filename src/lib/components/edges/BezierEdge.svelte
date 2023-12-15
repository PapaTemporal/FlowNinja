<script lang="ts">
    import { getBezierPath } from '$lib/utils';
    import type { EdgeType, NodeType } from '$lib/types';
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
        sourceNode = $nodes.find(node => node.id === edge.source);
        targetNode = $nodes.find(node => node.id === edge.target);

        if (sourceNode) {
            sourceX = sourceNode.transform.x + sourceNode.transform.width / 2;
            sourceY = sourceNode.transform.y + sourceNode.transform.height / 2;
        }

        if (targetNode) {
            targetX = targetNode.transform.x + targetNode.transform.width / 2;
            targetY = targetNode.transform.y + targetNode.transform.height / 2;
        }
    }

    $: [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceDirection: edge.sourceDirection,
        targetDirection: edge.targetDirection,
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
