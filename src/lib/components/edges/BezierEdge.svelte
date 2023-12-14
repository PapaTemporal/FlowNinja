<script lang="ts">
    import BaseEdge from './BaseEdge.svelte';
    import {
        getBezierPath,
        getEdgeSourceAndTargetNodePositions,
    } from '$lib/utils';
    import { v4 as uuidv4 } from 'uuid';
    import type { EdgeType, NodeType } from '$lib/types';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';

    export let id = uuidv4();
    export let edge: EdgeType;
    export let style = '';

    const nodes: Writable<NodeType[]> = getContext('nodesStore');

    let { sourceX, sourceY, targetX, targetY } =
        getEdgeSourceAndTargetNodePositions(edge, $nodes);

    $: [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceDirection: edge.sourceDirection,
        targetDirection: edge.targetDirection,
    });
</script>

<BaseEdge
    {id}
    {path}
    markerStart={edge.markerStart}
    markerEnd={edge.markerEnd}
    {style}
/>
