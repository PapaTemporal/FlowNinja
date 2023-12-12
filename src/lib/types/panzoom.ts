import type { Selection } from 'd3-selection';
import type { ZoomTransform, ZoomBehavior } from 'd3-zoom';
import type { Writable } from 'svelte/store';

export type Viewport = {
    x: number;
    y: number;
    zoom: number;
};
export type Transform = [number, number, number];
export type CoordinateExtent = [[number, number], [number, number]];

export type D3ZoomInstance = ZoomBehavior<Element, unknown>;
export type D3SelectionInstance = Selection<Element, unknown, null, undefined>;
export type D3ZoomHandler = (this: Element, event: any, d: unknown) => void;
export enum PanOnScrollMode {
    Free = 'free',
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}
export type OnDraggingChange = (dragging: boolean) => void;
export type OnTransformChange = (transform: Transform) => void;

export type OnPanZoom = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;

export type ZoomPanValues = {
    isZoomingOrPanning: boolean;
    usedRightMouseButton: boolean;
    prevViewport: Viewport;
    mouseButton: number;
    timerId: ReturnType<typeof setTimeout> | undefined;
    panScrollTimeout: ReturnType<typeof setTimeout> | undefined;
    isPanScrolling: boolean;
};

export type PanOnScrollParams = {
    zoomPanValues: ZoomPanValues;
    noWheelClassName: string;
    d3Selection: D3SelectionInstance;
    d3Zoom: D3ZoomInstance;
    panOnScrollMode: PanOnScrollMode;
    panOnScrollSpeed: number;
    zoomOnPinch: boolean;
    onPanZoomStart?: OnPanZoom;
    onPanZoom?: OnPanZoom;
    onPanZoomEnd?: OnPanZoom;
};

export type ZoomOnScrollParams = {
    noWheelClassName: string;
    preventScrolling: boolean;
    d3ZoomHandler: D3ZoomHandler;
};

export type PanZoomStartParams = {
    zoomPanValues: ZoomPanValues;
    onDraggingChange: OnDraggingChange;
    onPanZoomStart?: OnPanZoom;
};

export type PanZoomHandlerParams = {
    zoomPanValues: ZoomPanValues;
    panOnDrag: boolean | number[];
    onPaneContextMenu: boolean;
    onTransformChange: OnTransformChange;
    onPanZoom?: OnPanZoom;
};

export type PanZoomEndParams = {
    zoomPanValues: ZoomPanValues;
    panOnDrag: boolean | number[];
    panOnScroll: boolean;
    onDraggingChange: (isDragging: boolean) => void;
    onPanZoomEnd?: OnPanZoom;
    onPaneContextMenu?: (event: any) => void;
};

export type PanZoomParams = {
    domNode: Element;
    minZoom: number;
    maxZoom: number;
    viewport: Viewport;
    translateExtent: CoordinateExtent;
    onTransformChange: OnTransformChange;
    onDraggingChange: OnDraggingChange;
    onPanZoomStart?: OnPanZoom;
    onPanZoom?: OnPanZoom;
    onPanZoomEnd?: OnPanZoom;
};

export type PanZoomUpdateOptions = {
    noWheelClassName: string;
    noPanClassName: string;
    onPaneContextMenu?: (event: MouseEvent) => void;
    preventScrolling: boolean;
    panOnScroll: boolean;
    panOnDrag: boolean | number[];
    panOnScrollMode: PanOnScrollMode;
    panOnScrollSpeed: number;
    userSelectionActive: boolean;
    zoomOnPinch: boolean;
    zoomOnScroll: boolean;
    zoomOnDoubleClick: boolean;
    zoomActivationKeyPressed: boolean;
    lib: string;
};

export type PanZoomTransformOptions = {
    duration?: number;
};

export type FilterParams = {
    zoomActivationKeyPressed: boolean;
    zoomOnScroll: boolean;
    zoomOnPinch: boolean;
    panOnDrag: boolean | number[];
    panOnScroll: boolean;
    zoomOnDoubleClick: boolean;
    userSelectionActive: boolean;
    noWheelClassName: string;
    noPanClassName: string;
    lib: string;
};

export type PanZoomInstance = {
    update: (params: PanZoomUpdateOptions) => void;
    destroy: () => void;
    getViewport: () => Viewport;
    setViewport: (viewport: Viewport, options?: PanZoomTransformOptions) => ZoomTransform | undefined;
    setViewportConstrained: (viewport: Viewport, extent: CoordinateExtent, translateExtent: CoordinateExtent) => ZoomTransform | undefined;
    setScaleExtent: (scaleExtent: [number, number]) => void;
    setTranslateExtent: (translateExtent: CoordinateExtent) => void;
    scaleTo: (scale: number, options?: PanZoomTransformOptions) => void;
    scaleBy: (factor: number, options?: PanZoomTransformOptions) => void;
    syncViewport: (viewport: Viewport) => void;
};

export type ZoomParams = {
    viewport: Writable<Viewport>;
    initialViewport: Viewport;
    minZoom: number;
    maxZoom: number;
    dragging: Writable<boolean>;
    onPanZoomStart?: OnPanZoom;
    onPanZoom?: OnPanZoom;
    onPanZoomEnd?: OnPanZoom;
    onPaneContextMenu?: (event: MouseEvent) => void;
    translateExtent: CoordinateExtent;
    panZoom: Writable<PanZoomInstance | null>;
    zoomOnScroll: boolean;
    zoomOnPinch: boolean;
    zoomOnDoubleClick: boolean;
    panOnScroll: boolean;
    panOnDrag: boolean | number[];
    panOnScrollSpeed: number;
    panOnScrollMode: PanOnScrollMode;
    zoomActivationKeyPressed: boolean;
    preventScrolling: boolean;
    // last two instances of 'classname' being used
    // changing it to class would require object restructuring for use with panZoomInstance.update
    noPanClassName: string;
    noWheelClassName: string;
    userSelectionActive: boolean;
    lib: string;
};