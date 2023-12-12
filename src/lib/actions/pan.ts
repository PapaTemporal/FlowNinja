import { onMount } from 'svelte';
import type { Writable } from 'svelte/store';

export function pan(node: HTMLElement, { scale }: { scale: Writable<number> }) {
    let x: number;
    let y: number;
    let dx: number;
    let dy: number;
    let resizeObserver: ResizeObserver;
    let offsetX: number;
    let offsetY: number;
    let extents: {
        maxX: number;
        maxY: number;
        minX: number;
        minY: number;
    };
    let clampedX: number;
    let clampedY: number;
    let currentScale: number;
    let unsubscribe: () => void;

    onMount(() => {
        const parentElement = node.parentElement;
        if (parentElement) {
            resizeObserver = new ResizeObserver(() => {
                const { height: pHeight, width: pWidth } = parentElement.getBoundingClientRect();

                const cHeight = pHeight * 8;
                const cWidth = pWidth * 8;
                offsetX = cWidth - (pWidth * 4);
                offsetY = cHeight - (pHeight * 4);

                extents = {
                    maxX: offsetX * currentScale - pWidth / 2,
                    maxY: offsetY * currentScale - pHeight / 2,
                    minX: offsetX - cWidth,
                    minY: offsetY - cHeight,
                };

                clampedX = Math.min(Math.max((-cWidth + pWidth) / 2, extents.minX), extents.maxX);
                clampedY = Math.min(Math.max((-cHeight + pHeight) / 2, extents.minY), extents.maxY);

                node.style.transform = `scale(${currentScale}) translate(${clampedX}px, ${clampedY}px)`;
                node.style.height = `${cHeight}px`;
                node.style.width = `${cWidth}px`;
            });

            resizeObserver.observe(parentElement);

            scale.subscribe(value => {
                currentScale = value;

                node.style.transform = `scale(${currentScale}) translate(${clampedX}px, ${clampedY}px)`;
            });
        }
    });

    function handleMousedown(event: MouseEvent) {
        x = event.clientX * currentScale;
        y = event.clientY * currentScale;
        const style = window.getComputedStyle(node);
        const transform = style.transform;

        const matrix = new DOMMatrixReadOnly(transform);
        dx = matrix.m41;
        dy = matrix.m42;

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(event: MouseEvent) {
        let moveX = dx + (event.clientX * currentScale) - x;
        let moveY = dy + (event.clientY * currentScale) - y;

        clampedX = Math.min(Math.max(moveX, extents.minX), extents.maxX);
        clampedY = Math.min(Math.max(moveY, extents.minY), extents.maxY);

        node.style.transform = `scale(${currentScale}) translate(${clampedX}px, ${clampedY}px)`;
    }

    function handleMouseup() {
        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
    }

    node.addEventListener('mousedown', handleMousedown);

    return {
        destroy() {
            if (unsubscribe) {
                unsubscribe();
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            node.removeEventListener('mousedown', handleMousedown);
            window.removeEventListener('mousemove', handleMousemove);
            window.removeEventListener('mouseup', handleMouseup);
        }
    };
}