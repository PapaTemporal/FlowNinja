<script lang="ts">
    import { FlowNinja, createStore } from '$lib/index.js';

    let nodes = [
        {
            id: '1',
            type: 'default',
            transform: {
                x: 100,
                y: 100,
                height: 100,
                width: 100,
            },
            data: {
                label: 'Node 1',
            },
        },
        {
            id: '2',
            type: 'default',
            transform: {
                x: 250,
                y: 100,
                height: 30,
                width: 150,
            },
            data: {
                label: 'Node 1',
            },
        },
    ];
    let edges = [
        {
            id: '1',
            type: 'default',
            source: '1',
            target: '2',
        },
    ];

    const { key, store } = createStore({
        nodes,
        edges,
    });
</script>

<div class="test">
    <FlowNinja {key} {store} />
</div>

<style>
    .test {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .controls {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        padding: 10px;
    }
</style>
