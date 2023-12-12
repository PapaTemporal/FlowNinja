import { type ZoomTransform, zoom as d3Zoom, zoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import type {
    ZoomPanValues,
    PanZoomTransformOptions,
    PanZoomUpdateOptions,
    Viewport,
    CoordinateExtent,
    ZoomParams,
} from '$lib/types';
import {
    clamp,
    createFilter,
    wheelDelta,
    getD3Transition,
    createPanOnScrollHandler,
    createZoomOnScrollHandler,
    createPanZoomStartHandler,
    createPanZoomHandler,
    createPanZoomEndHandler,
    viewportToTransform,
} from '$lib/utils';

export default function zoom(node: Element, params: ZoomParams) {
    const { minZoom, maxZoom, viewport, initialViewport, panZoom, translateExtent } =
        params;
    const zoomPanValues: ZoomPanValues = {
        isZoomingOrPanning: false,
        usedRightMouseButton: false,
        prevViewport: { x: 0, y: 0, zoom: 0 },
        mouseButton: 0,
        timerId: undefined,
        panScrollTimeout: undefined,
        isPanScrolling: false,
    };

    const bbox = node.getBoundingClientRect();
    const d3ZoomInstance = d3Zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
    const d3Selection = select(node).call(d3ZoomInstance);

    function onDraggingChange(isDragging: boolean) {
        // zoomPanValues.isZoomingOrPanning = isDragging;
    }

    function onTransformChange(transform: ZoomTransform) {
        // viewport.set({ x: transform.x, y: transform.y, zoom: transform.k });
    }

    function onPanZoomStart(event: any, viewport: Viewport) {
        // zoomPanValues.mouseButton = event.button || 0;
        // zoomPanValues.isZoomingOrPanning = true;
        // zoomPanValues.prevViewport = viewport;
    }

    function onPanZoom(event: any, viewport: Viewport) {
        // viewport.set(viewport);
    }

    function onPanZoomEnd(event: any, viewport: Viewport) {
        // zoomPanValues.isZoomingOrPanning = false;
    }

    setViewportConstrained(
        {
            x: initialViewport.x,
            y: initialViewport.y,
            zoom: clamp(initialViewport.zoom, minZoom, maxZoom),
        },
        [
            [0, 0],
            [bbox.width, bbox.height],
        ],
        translateExtent
    );

    const d3ZoomHandler = d3Selection.on('wheel.zoom')!;
    d3ZoomInstance.wheelDelta(wheelDelta);

    function setTransform(transform: ZoomTransform, options?: PanZoomTransformOptions) {
        if (d3Selection) {
            d3ZoomInstance?.transform(getD3Transition(d3Selection, options?.duration), transform);
        }
    }

    // public functions
    function update({
        noWheelClassName,
        noPanClassName,
        onPaneContextMenu,
        userSelectionActive,
        panOnScroll,
        panOnDrag,
        panOnScrollMode,
        panOnScrollSpeed,
        preventScrolling,
        zoomOnPinch,
        zoomOnScroll,
        zoomOnDoubleClick,
        zoomActivationKeyPressed,
        lib,
    }: PanZoomUpdateOptions) {
        if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
            destroy();
        }

        const isPanOnScroll = panOnScroll && !zoomActivationKeyPressed && !userSelectionActive;

        const wheelHandler = isPanOnScroll
            ? createPanOnScrollHandler({
                zoomPanValues,
                noWheelClassName,
                d3Selection,
                d3Zoom: d3ZoomInstance,
                panOnScrollMode,
                panOnScrollSpeed,
                zoomOnPinch,
                onPanZoomStart,
                onPanZoom,
                onPanZoomEnd,
            })
            : createZoomOnScrollHandler({
                noWheelClassName,
                preventScrolling,
                d3ZoomHandler,
            });

        d3Selection.on('wheel.zoom', wheelHandler, { passive: false });

        if (!userSelectionActive) {
            // pan zoom start
            const startHandler = createPanZoomStartHandler({
                zoomPanValues,
                onDraggingChange,
                onPanZoomStart,
            });
            d3ZoomInstance.on('start', startHandler);

            // pan zoom
            const panZoomHandler = createPanZoomHandler({
                zoomPanValues,
                panOnDrag,
                onPaneContextMenu: !!onPaneContextMenu,
                onPanZoom,
                onTransformChange,
            });
            d3ZoomInstance.on('zoom', panZoomHandler);

            // pan zoom end
            const panZoomEndHandler = createPanZoomEndHandler({
                zoomPanValues,
                panOnDrag,
                panOnScroll,
                onPaneContextMenu,
                onPanZoomEnd,
                onDraggingChange,
            });
            d3ZoomInstance.on('end', panZoomEndHandler);
        }

        const filter = createFilter({
            zoomActivationKeyPressed,
            panOnDrag,
            zoomOnScroll,
            panOnScroll,
            zoomOnDoubleClick,
            zoomOnPinch,
            userSelectionActive,
            noPanClassName,
            noWheelClassName,
            lib,
        });
        d3ZoomInstance.filter(filter);
    }

    function destroy() {
        d3ZoomInstance.on('zoom', null);
    }

    function setViewportConstrained(
        viewport: Viewport,
        extent: CoordinateExtent,
        translateExtent: CoordinateExtent
    ): ZoomTransform | undefined {
        const nextTransform = viewportToTransform(viewport);
        const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent);
        if (contrainedTransform) {
            setTransform(contrainedTransform);
        }

        return contrainedTransform;
    }

    function setViewport(viewport: Viewport, options?: PanZoomTransformOptions) {
        const nextTransform = viewportToTransform(viewport);

        setTransform(nextTransform, options);

        return nextTransform;
    }

    function syncViewport(viewport: Viewport) {
        if (d3Selection) {
            const nextTransform = viewportToTransform(viewport);
            const currentTransform = d3Selection.property('__zoom');

            if (
                currentTransform.k !== viewport.zoom ||
                currentTransform.x !== viewport.x ||
                currentTransform.y !== viewport.y
            ) {
                // @ts-ignore
                d3ZoomInstance?.transform(d3Selection, nextTransform, null, { sync: true });
            }
        }
    }

    function getViewport(): Viewport {
        const transform = d3Selection ? zoomTransform(d3Selection.node() as Element) : { x: 0, y: 0, k: 1 };
        return { x: transform.x, y: transform.y, zoom: transform.k };
    }

    function scaleTo(zoom: number, options?: PanZoomTransformOptions) {
        if (d3Selection) {
            d3ZoomInstance?.scaleTo(getD3Transition(d3Selection, options?.duration), zoom);
        }
    }

    function scaleBy(factor: number, options?: PanZoomTransformOptions) {
        if (d3Selection) {
            d3ZoomInstance?.scaleBy(getD3Transition(d3Selection, options?.duration), factor);
        }
    }

    function setScaleExtent(scaleExtent: [number, number]) {
        d3ZoomInstance?.scaleExtent(scaleExtent);
    }

    function setTranslateExtent(translateExtent: CoordinateExtent) {
        d3ZoomInstance?.translateExtent(translateExtent);
    }

    viewport.set(getViewport());
    panZoom.set({
        update,
        destroy,
        setViewport,
        setViewportConstrained,
        getViewport,
        scaleTo,
        scaleBy,
        setScaleExtent,
        setTranslateExtent,
        syncViewport,
    })
    update(params);

    return {
        update,
        destroy,
        setViewport,
        setViewportConstrained,
        getViewport,
        scaleTo,
        scaleBy,
        setScaleExtent,
        setTranslateExtent,
        syncViewport,
    };
}