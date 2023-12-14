<script lang="ts">
    import { onMount, setContext } from 'svelte';
    import type { StoreType } from '$lib/types';
    import NodeRenderer from './NodeRenderer.svelte';
    import EdgeRenderer from './EdgeRenderer.svelte';

    export let key: string;
    export let store: StoreType;

    const { viewportStore, nodesStore, edgesStore } = store;

    let {
        x: translateX,
        y: translateY,
        height,
        width,
        scale,
        scaleExtents,
    } = viewportStore;
    let nodes = $nodesStore;
    let edges = $edgesStore;

    setContext('key', key);
    setContext('nodesStore', nodesStore);
    setContext('edgesStore', edgesStore);
    setContext('scale', scale);

    let viewportElement: HTMLElement;
    let pWidth: number;
    let pHeight: number;
    let translateExtents: {
        min: [number, number];
        max: [number, number];
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
            let newTranslateX = $translateX + (event.clientX - lastX) / $scale;
            let newTranslateY = $translateY + (event.clientY - lastY) / $scale;

            // Clamp translation to the translateExtents
            newTranslateX = Math.max(
                Math.min(newTranslateX, translateExtents.max[0]),
                translateExtents.min[0]
            );
            newTranslateY = Math.max(
                Math.min(newTranslateY, translateExtents.max[1]),
                translateExtents.min[1]
            );

            translateX.set(newTranslateX);
            translateY.set(newTranslateY);

            lastX = event.clientX;
            lastY = event.clientY;
        }
    }

    onMount(() => {
        const bbox = viewportElement.getBoundingClientRect();
        pWidth = bbox.width;
        pHeight = bbox.height;

        if (!$width) width.set(bbox.width * 4);
        if (!$height) height.set(bbox.height * 4);

        if (!$translateX) translateX.set(-$width / 2 + pWidth / 2 / $scale);
        if (!$translateY) translateY.set(-$height / 2 + pHeight / 2 / $scale);

        translateExtents = {
            min: [-$width + pWidth, -$height + pHeight],
            max: [0, 0],
        };
    });

    function wheel(node: HTMLElement) {
        function handleWheel(event: {
            preventDefault: () => void;
            deltaY: number;
        }) {
            event.preventDefault();

            scale.set(
                Math.max(
                    $scaleExtents[0],
                    Math.min(
                        $scaleExtents[1],
                        $scale * (event.deltaY > 0 ? 1.1 : 0.9)
                    )
                )
            );

            // Calculate the new translate extents
            translateExtents = {
                min: [-$width + pWidth / $scale, -$height + pHeight / $scale],
                max: [0, 0],
            };

            translateX.set(
                Math.max(
                    Math.min($translateX, translateExtents.max[0]),
                    translateExtents.min[0]
                )
            );

            translateY.set(
                Math.max(
                    Math.min($translateY, translateExtents.max[1]),
                    translateExtents.min[1]
                )
            );
        }

        node.addEventListener('wheel', handleWheel, { passive: false });

        return {
            destroy() {
                node.removeEventListener('wheel', handleWheel);
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
        style="transform: scale({$scale}) translate({$translateX}px, {$translateY}px); width: {$width}px; height: {$height}px; transform-origin: top left;"
    >
        <NodeRenderer />
        <EdgeRenderer />
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
</style>
