<script lang="ts">
    import { writable } from "svelte/store";
    import { v4 as uuid4 } from "uuid";
    import { FlowNinja } from "$lib";

    let elm: HTMLElement;

    const tmpId = uuid4();
    let flowStore = {
        id: writable(tmpId),
        name: writable(`Flow-${tmpId}`),
        scale: writable(1),
        step: writable(0.1),
        scaleExtents: writable({
            min: 0.5,
            max: 1.5,
        }),
        nodes: writable([
            {
                type: "default",
                x: 3000,
                y: 1000,
                height: "50px",
                width: "100px",
            },
        ]),
        edges: writable([]),
    };
    const { scale, step, scaleExtents } = flowStore;

    function zoomIn() {
        scale.update((currentScale) =>
            Math.min($scaleExtents.max, currentScale + $step),
        );
    }

    function zoomOut() {
        scale.update((currentScale) =>
            Math.max($scaleExtents.min, currentScale - $step),
        );
    }
</script>

<div class="test" bind:this={elm}>
    <FlowNinja {flowStore} />
    <div class="controls">
        <button on:click={zoomIn}>Zoom In</button>
        <button on:click={zoomOut}>Zoom Out</button>
        <span>{Math.round($scale * 100)}%</span>
    </div>
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
