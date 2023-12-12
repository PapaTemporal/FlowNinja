import type {
    Viewport,
    D3SelectionInstance,
    FilterParams,
    PanOnScrollParams,
    ZoomOnScrollParams,
    PanZoomStartParams,
    PanZoomHandlerParams,
    PanZoomEndParams,
} from "$lib/types";
import { PanOnScrollMode } from "$lib/types";
import { pointer } from "d3-selection";
import { zoomIdentity, type ZoomTransform, type D3ZoomEvent } from "d3-zoom";


export const isWrappedWithClass = (event: any, className: string | undefined) => event.target.closest(`.${className}`);

export const isRightClickPan = (panOnDrag: boolean | number[], usedButton: number) =>
    usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);

export const transformToViewport = (transform: ZoomTransform): Viewport => ({
    x: transform.x,
    y: transform.y,
    zoom: transform.k,
});

export const viewportToTransform = ({ x, y, zoom }: Viewport): ZoomTransform =>
    zoomIdentity.translate(x, y).scale(zoom);

export const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

export const getD3Transition = (selection: D3SelectionInstance, duration = 0) =>
    typeof duration === 'number' && duration > 0 ? selection.transition().duration(duration) : selection;

export const isMacOs = () => typeof navigator !== 'undefined' && navigator?.userAgent?.indexOf('Mac') >= 0;

export const wheelDelta = (event: any) => {
    const factor = event.ctrlKey && isMacOs() ? 10 : 1;

    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
};

export const viewChanged = (prevViewport: Viewport, eventViewport: any): boolean =>
    prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;

export function createFilter({
    zoomActivationKeyPressed,
    zoomOnScroll,
    zoomOnPinch,
    panOnDrag,
    panOnScroll,
    zoomOnDoubleClick,
    userSelectionActive,
    noWheelClassName,
    noPanClassName,
    lib,
}: FilterParams) {
    return (event: any): boolean => {
        const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
        const pinchZoom = zoomOnPinch && event.ctrlKey;

        if (
            event.button === 1 &&
            event.type === 'mousedown' &&
            (isWrappedWithClass(event, `${lib}-flow__node`) || isWrappedWithClass(event, `${lib}-flow__edge`))
        ) {
            return true;
        }

        // if all interactions are disabled, we prevent all zoom events
        if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
            return false;
        }

        // during a selection we prevent all other interactions
        if (userSelectionActive) {
            return false;
        }

        // if zoom on double click is disabled, we prevent the double click event
        if (!zoomOnDoubleClick && event.type === 'dblclick') {
            return false;
        }

        // if the target element is inside an element with the nowheel class, we prevent zooming
        if (isWrappedWithClass(event, noWheelClassName) && event.type === 'wheel') {
            return false;
        }

        // if the target element is inside an element with the nopan class, we prevent panning
        if (
            isWrappedWithClass(event, noPanClassName) &&
            (event.type !== 'wheel' || (panOnScroll && event.type === 'wheel' && !zoomActivationKeyPressed))
        ) {
            return false;
        }

        if (!zoomOnPinch && event.ctrlKey && event.type === 'wheel') {
            return false;
        }

        // when there is no scroll handling enabled, we prevent all wheel events
        if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === 'wheel') {
            return false;
        }

        // if the pane is not movable, we prevent dragging it with mousestart or touchstart
        if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
            return false;
        }

        // if the pane is only movable using allowed clicks
        if (
            Array.isArray(panOnDrag) &&
            !panOnDrag.includes(event.button) &&
            (event.type === 'mousedown' || event.type === 'touchstart')
        ) {
            return false;
        }

        // We only allow right clicks if pan on drag is set to right click
        const buttonAllowed =
            (Array.isArray(panOnDrag) && panOnDrag.includes(event.button)) || !event.button || event.button <= 1;

        // default filter for d3-zoom
        return (!event.ctrlKey || event.type === 'wheel') && buttonAllowed;
    };
}

export function createPanOnScrollHandler({
    zoomPanValues,
    noWheelClassName,
    d3Selection,
    d3Zoom,
    panOnScrollMode,
    panOnScrollSpeed,
    zoomOnPinch,
    onPanZoomStart,
    onPanZoom,
    onPanZoomEnd,
}: PanOnScrollParams) {
    return (event: any) => {
        if (isWrappedWithClass(event, noWheelClassName)) {
            return false;
        }
        event.preventDefault();
        event.stopImmediatePropagation();

        const currentZoom = d3Selection.property('__zoom').k || 1;
        const _isMacOs = isMacOs();

        // macos sets ctrlKey=true for pinch gesture on a trackpad
        if (event.ctrlKey && zoomOnPinch && _isMacOs) {
            const point = pointer(event);
            const pinchDelta = wheelDelta(event);
            const zoom = currentZoom * Math.pow(2, pinchDelta);
            // @ts-ignore
            d3Zoom.scaleTo(d3Selection, zoom, point, event);

            return;
        }

        // increase scroll speed in firefox
        // firefox: deltaMode === 1; chrome: deltaMode === 0
        const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
        let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
        let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;

        // this enables vertical scrolling with shift + scroll on windows
        if (!_isMacOs && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
            deltaX = event.deltaY * deltaNormalize;
            deltaY = 0;
        }

        d3Zoom.translateBy(
            d3Selection,
            -(deltaX / currentZoom) * panOnScrollSpeed,
            -(deltaY / currentZoom) * panOnScrollSpeed,
            // @ts-ignore
            { internal: true }
        );

        const nextViewport = transformToViewport(d3Selection.property('__zoom'));

        clearTimeout(zoomPanValues.panScrollTimeout);

        // for pan on scroll we need to handle the event calls on our own
        // we can't use the start, zoom and end events from d3-zoom
        // because start and move gets called on every scroll event and not once at the beginning
        if (!zoomPanValues.isPanScrolling) {
            zoomPanValues.isPanScrolling = true;

            onPanZoomStart?.(event, nextViewport);
        }

        if (zoomPanValues.isPanScrolling) {
            onPanZoom?.(event, nextViewport);

            zoomPanValues.panScrollTimeout = setTimeout(() => {
                onPanZoomEnd?.(event, nextViewport);

                zoomPanValues.isPanScrolling = false;
            }, 150);
        }
    };
}

export function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }: ZoomOnScrollParams) {
    return function (this: Element, event: any, d: unknown) {
        if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
            return null;
        }

        event.preventDefault();

        d3ZoomHandler.call(this, event, d);
    };
}

export function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }: PanZoomStartParams) {
    return (event: D3ZoomEvent<HTMLDivElement, any>) => {
        if (event.sourceEvent?.internal) {
            return;
        }

        const viewport = transformToViewport(event.transform);

        // we need to remember it here, because it's always 0 in the "zoom" event
        zoomPanValues.mouseButton = event.sourceEvent?.button || 0;
        zoomPanValues.isZoomingOrPanning = true;
        zoomPanValues.prevViewport = viewport;

        if (event.sourceEvent?.type === 'mousedown') {
            onDraggingChange(true);
        }

        if (onPanZoomStart) {
            onPanZoomStart?.(event.sourceEvent as MouseEvent | TouchEvent, viewport);
        }
    };
}

export function createPanZoomHandler({
    zoomPanValues,
    panOnDrag,
    onPaneContextMenu,
    onTransformChange,
    onPanZoom,
}: PanZoomHandlerParams) {
    return (event: D3ZoomEvent<HTMLDivElement, any>) => {
        zoomPanValues.usedRightMouseButton = !!(
            onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0)
        );

        if (!event.sourceEvent?.sync) {
            onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
        }

        if (onPanZoom && !event.sourceEvent?.internal) {
            onPanZoom?.(event.sourceEvent as MouseEvent | TouchEvent, transformToViewport(event.transform));
        }
    };
}

export function createPanZoomEndHandler({
    zoomPanValues,
    panOnDrag,
    panOnScroll,
    onDraggingChange,
    onPanZoomEnd,
    onPaneContextMenu,
}: PanZoomEndParams) {
    return (event: D3ZoomEvent<HTMLDivElement, any>) => {
        if (event.sourceEvent?.internal) {
            return;
        }
        zoomPanValues.isZoomingOrPanning = false;

        if (
            onPaneContextMenu &&
            isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) &&
            !zoomPanValues.usedRightMouseButton &&
            event.sourceEvent
        ) {
            onPaneContextMenu(event.sourceEvent);
        }
        zoomPanValues.usedRightMouseButton = false;

        onDraggingChange(false);

        if (onPanZoomEnd && viewChanged(zoomPanValues.prevViewport, event.transform)) {
            const viewport = transformToViewport(event.transform);
            zoomPanValues.prevViewport = viewport;

            clearTimeout(zoomPanValues.timerId);
            zoomPanValues.timerId = setTimeout(
                () => {
                    onPanZoomEnd?.(event.sourceEvent as MouseEvent | TouchEvent, viewport);
                },
                // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
                panOnScroll ? 150 : 0
            );
        }
    };
}