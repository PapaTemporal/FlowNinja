<script lang="ts">
    import { onMount } from "svelte";

    // import { onMount, setContext } from "svelte";
    // import { writable } from "svelte/store";
    // import { zoom } from "$lib/actions";
    // import type { FlowStore } from "$lib";
    // import { v4 as uuid4 } from "uuid";
    // import { nodeTypes } from "../nodes";
    // import { pan } from "$lib/actions/pan.js";

    // export let flowStore: Partial<FlowStore>;

    // if (!flowStore) {
    //     const tmpId = uuid4();
    //     flowStore = {
    //         id: writable(tmpId),
    //         name: writable(`Flow-${tmpId}`),
    //         scale: writable(1),
    //         step: writable(0.1),
    //         scaleExtents: writable({
    //             min: 0.5,
    //             max: 1.5,
    //         }),
    //         nodes: writable([]),
    //         edges: writable([]),
    //         nodeTypes,
    //     };
    // }

    // const {
    //     id,
    //     name,
    //     scale,
    //     step,
    //     scaleExtents,
    //     nodes,
    //     edges,
    //     nodeTypes: customNodeTypes,
    // } = flowStore;

    // setContext("id", id);
    // setContext("name", name || `Flow-${$id}`);
    // setContext("scale", scale);
    // setContext("step", step);
    // setContext("scaleExtents", scaleExtents);
    // setContext("nodes", nodes);
    // setContext("edges", edges);

    // const allNodeTypes = {
    //     ...nodeTypes,
    //     ...customNodeTypes,
    // };

    // const viewport = writable({
    //     x: 0,
    //     y: 0,
    //     zoom: 1,
    // });
    // const initialViewport = {
    //     x: 0,
    //     y: 0,
    //     zoom: 1,
    // };
    // const minZoom = 0.5;
    // const maxZoom = 1.5;
    // const dragging = writable(false);
    // const translateExtent = [
    //     [0, 0],
    //     [15000, 10000],
    // ];
    // const panZoom = writable(null);
    // const lib = "svelte";

    let viewportElement: HTMLElement;
    let pWidth: number;
    let pHeight: number;
    let width: number;
    let height: number;

    export let translateX: number;
    export let translateY: number;
    export let translateExtents: {
        min: [number, number];
        max: [number, number];
    };

    export let scale = 1;
    export let scaleExtents = {
        min: 0.5,
        max: 1.5,
    };

    let dragging = false;
    let lastX: number, lastY: number;

    function handleMouseDown(event: { clientX: any; clientY: any }) {
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }

    function handleMouseUp() {
        dragging = false;
    }

    function handleMouseMove(event: { clientX: number; clientY: number }) {
        if (dragging) {
            let newTranslateX = translateX + (event.clientX - lastX) / scale;
            let newTranslateY = translateY + (event.clientY - lastY) / scale;

            // Clamp translation to the translateExtents
            newTranslateX = Math.max(
                Math.min(newTranslateX, translateExtents.max[0]),
                translateExtents.min[0],
            );
            newTranslateY = Math.max(
                Math.min(newTranslateY, translateExtents.max[1]),
                translateExtents.min[1],
            );

            translateX = newTranslateX;
            translateY = newTranslateY;

            lastX = event.clientX;
            lastY = event.clientY;
        }
    }

    onMount(() => {
        const bbox = viewportElement.getBoundingClientRect();
        pWidth = bbox.width;
        pHeight = bbox.height;

        width = bbox.width * 4;
        height = bbox.height * 4;

        if (!translateX) translateX = -width / 2 + pWidth / 2 / scale;
        if (!translateY) translateY = -height / 2 + pHeight / 2 / scale;

        translateExtents = {
            min: [-width + pWidth, -height + pHeight],
            max: [0, 0],
        };
    });

    function wheel(node: HTMLElement) {
        function handleWheel(event: {
            preventDefault: () => void;
            deltaY: number;
        }) {
            event.preventDefault();

            scale = Math.max(
                scaleExtents.min,
                Math.min(
                    scaleExtents.max,
                    scale * (event.deltaY > 0 ? 1.1 : 0.9),
                ),
            );

            // Calculate the new translate extents
            translateExtents = {
                min: [-width + pWidth / scale, -height + pHeight / scale],
                max: [0, 0],
            };

            translateX = Math.max(
                Math.min(translateX, translateExtents.max[0]),
                translateExtents.min[0],
            );

            translateY = Math.max(
                Math.min(translateY, translateExtents.max[1]),
                translateExtents.min[1],
            );
        }

        node.addEventListener("wheel", handleWheel, { passive: false });

        return {
            destroy() {
                node.removeEventListener("wheel", handleWheel);
            },
        };
    }
</script>

<div class="viewport" bind:this={viewportElement}>
    <div
        class="panner"
        role="button"
        tabindex="0"
        use:wheel
        on:mousedown={handleMouseDown}
        on:mouseup={handleMouseUp}
        on:mousemove={handleMouseMove}
        style="transform: scale({scale}) translate({translateX}px, {translateY}px); width: {width}px; height: {height}px; transform-origin: top left;"
    />
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
</style>
