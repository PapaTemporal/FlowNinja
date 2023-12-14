<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import { edgeTypes } from '../edges';
    import type { EdgeType, NodeType } from '$lib/types';

    export let edge: EdgeType;
    export let scale: Writable<number>;

    const nodesStore: Writable<NodeType[]> = getContext('nodesStore');

    let sourceNode: NodeType, targetNode: NodeType;

    $: {
        sourceNode = $nodesStore.find(node => node.id === edge.source);
        targetNode = $nodesStore.find(node => node.id === edge.target);
    }
</script>

{#if edgeTypes[edge.type]}
    <svelte:component
        this={edgeTypes[edge.type]}
        {edge}
        {sourceNode}
        {targetNode}
        {scale}
    />
{:else}
    <svelte:component
        this={edgeTypes.default}
        {edge}
        {sourceNode}
        {targetNode}
        {scale}
    />
{/if}
