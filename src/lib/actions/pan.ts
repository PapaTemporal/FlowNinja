import type { Writable } from 'svelte/store';

export function pan(
    node: HTMLElement,
    {
        id,
        transform,
        scale,
        updatePosition,
    }: {
        id: string;
        transform: { x: number; y: number; height: number; width: number };
        scale: Writable<number>;
        updatePosition: (id: string, x: number, y: number) => void;
    }
) {
    let x = transform.x;
    let y = transform.y;
    let lastX = 0;
    let lastY = 0;
    let isPanning = false;
    node.style.transform = `translate(${x}px, ${y}px)`;
    node.style.height = `${transform.height}px`;
    node.style.width = `${transform.width}px`;
    let localScale: number;

    const unsubscribe = scale.subscribe(value => {
        localScale = value;
    });

    function handleMousedown(event: MouseEvent) {
        event.stopPropagation();

        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);

        isPanning = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }

    function handleMousemove(event: MouseEvent) {
        event.stopPropagation();

        if (isPanning) {
            x = x + (event.clientX - lastX) / localScale;
            y = y + (event.clientY - lastY) / localScale;

            lastX = event.clientX;
            lastY = event.clientY;

            node.style.transform = `translate(${x}px, ${y}px)`;
            updatePosition(id, x, y);
        }
    }

    function handleMouseup(event: MouseEvent) {
        event.stopPropagation();

        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);

        isPanning = false;
    }

    node.addEventListener('mousedown', handleMousedown);

    return {
        destroy() {
            unsubscribe();
            node.removeEventListener('mousedown', handleMousedown);
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
        },
    };
}
