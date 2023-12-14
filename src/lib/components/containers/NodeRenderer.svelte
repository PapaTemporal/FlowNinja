<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import { pan } from '$lib/actions';
    import type { NodeType } from '$lib/types';
    import { nodeTypes } from '$lib/components/nodes';

    let nodes: Writable<NodeType[]> = getContext('nodesStore');
    let scale: Writable<number> = getContext('scale');

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
                node.x = x;
                node.y = y;
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
            scale,
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
