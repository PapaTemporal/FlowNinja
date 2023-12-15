<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import { pan } from '$lib/actions/index.js';
    import type { NodeType, ViewportType } from '$lib/types/index.js';
    import { nodeTypes } from '$lib/components/nodes/index.js';

    let nodes: Writable<NodeType[]> = getContext('nodesStore');
    let viewport: Writable<ViewportType> = getContext('viewportStore');

    function updateData(id: string, data: any) {
        nodes.update((nodes: NodeType[]) => {
            let node = nodes.find(node => node.id === id);
            if (node) {
                node.data = data;
            }
            return nodes;
        });
    }

    function updatePosition(id: string, x: number, y: number) {
        nodes.update((nodes: NodeType[]) => {
            let node = nodes.find(node => node.id === id);
            if (node) {
                node.transform.x = x;
                node.transform.y = y;
            }
            return nodes;
        });
    }
</script>

{#each $nodes as node}
    <div
        id={node.id}
        class="flow-ninja__node"
        use:pan={{
            ...node,
            viewport,
            updatePosition,
        }}
    >
        {#if nodeTypes[node.type]}
            <svelte:component
                this={nodeTypes[node.type]}
                {...node}
                {updateData}
            />
        {:else}
            <svelte:component this={nodeTypes.default} {...node} {updateData} />
        {/if}
    </div>
{/each}

<style>
    .flow-ninja__node {
        position: absolute;
    }
</style>
