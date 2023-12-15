import type { ViewportType } from '$lib/types/index.js';
import type { Writable } from 'svelte/store';

export function panzoom(
    node: HTMLElement,
    viewport: Writable<ViewportType>,
) {
    let lastX: number
    let lastY: number;
    let dragging = false;
    let translateExtents: {
        min: [number, number];
        max: [number, number];
    };

    let width: number;
    let height: number;

    const { width: pWidth, height: pHeight } = node.parentElement?.getBoundingClientRect() as DOMRect;

    const unsubscribe = viewport.subscribe(value => {
        width = value.width;
        height = value.height;

        if (!width || width < pWidth) {
            width = pWidth * 4;
        }
        if (!height || height < pHeight) {
            height = pHeight * 4;
        }
        if (!translateExtents) {
            translateExtents = {
                min: [-width + pWidth, -height + pHeight],
                max: [0, 0],
            };
        }

        node.style.scale = `${value.scale}`;
        node.style.translate = `${value.x}px ${value.y}px`;
        node.style.height = `${height}px`;
        node.style.width = `${width}px`;
        node.style.transformOrigin = 'top left';
    });

    function handleMousedown(event: MouseEvent) {
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);

        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }

    function handleMousemove(event: MouseEvent) {
        if (dragging) {
            viewport.update(value => {
                let newTranslateX = value.x + (event.clientX - lastX);
                let newTranslateY = value.y + (event.clientY - lastY);

                lastX = event.clientX;
                lastY = event.clientY;

                return {
                    ...value,
                    x: Math.max(Math.min(newTranslateX, translateExtents.max[0]), translateExtents.min[0]),
                    y: Math.max(Math.min(newTranslateY, translateExtents.max[1]), translateExtents.min[1])
                };
            });
        }
    }

    function handleMouseup() {
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);

        dragging = false;
    }

    function handleWheel(event: {
        preventDefault: () => void;
        deltaY: number;
    }) {
        event.preventDefault();

        viewport.update(value => {
            const localScale = Math.max(value.scaleExtents[0], Math.min(value.scaleExtents[1], value.scale * (event.deltaY > 0 ? 1.1 : 0.9)));

            translateExtents = {
                min: [(-width + pWidth / localScale) / 2, (-height + pHeight / localScale) / 2],
                max: [0, 0],
            };

            return {
                ...value,
                scale: localScale,
                x: Math.max(Math.min(value.x, translateExtents.max[0]), translateExtents.min[0]),
                y: Math.max(Math.min(value.y, translateExtents.max[1]), translateExtents.min[1]),
            };
        });
    }

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('wheel', handleWheel, { passive: false });

    return {
        destroy() {
            unsubscribe();
            node.removeEventListener('mousedown', handleMousedown);
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
            node.removeEventListener('wheel', handleWheel);
        },
    };
}