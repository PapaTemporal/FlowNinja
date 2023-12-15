<script lang="ts">
    import { onMount, setContext } from 'svelte';
    import type { StoreType } from '$lib/types';
    import NodeRenderer from './NodeRenderer.svelte';
    import EdgeRenderer from './EdgeRenderer.svelte';
    import { panzoom } from '$lib/actions';

    export let key: string;
    export let store: StoreType;

    const { viewportStore, nodesStore, edgesStore } = store;

    let { scale } = viewportStore;

    setContext('key', key);
    setContext('nodesStore', nodesStore);
    setContext('edgesStore', edgesStore);
    setContext('scale', scale);
</script>

<div class="viewport">
    <div
        class="panner"
        use:panzoom={{
            ...viewportStore,
        }}
    >
        <NodeRenderer />
        <svg id="flow-ninja__edges" class="flow-ninja__edges">
            <EdgeRenderer />
        </svg>
    </div>
</div>

<style>
    .viewport {
        position: relative;
        height: 100%;
        width: 100%;
        background-color: #444;
        z-index: 0;
        overflow: hidden;
    }
    .zoomer {
        height: 100%;
        width: 100%;
        transition: scale 0.2s ease-in-out;
    }
    .panner {
        background: linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            white;
        background-size: 30px 30px;
    }
    .svelte-flow__zoom {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
    }
    .flow-ninja__edges {
        height: 100%;
        width: 100%;
    }
</style>
