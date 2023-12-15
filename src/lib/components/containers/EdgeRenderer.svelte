<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import type { EdgeType } from '$lib/types';
    import { edgeTypes } from '$lib/components/edges';

    let edges: Writable<EdgeType[]> = getContext('edgesStore');
    // for future use
    // let scale: Writable<number> = getContext('scale');
</script>

{#each $edges as edge}
    {#if edgeTypes[edge.type]}
        <svelte:component this={edgeTypes[edge.type]} {edge} />
    {:else}
        <svelte:component this={edgeTypes.default} {edge} />
    {/if}
{/each}
