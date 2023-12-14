import type { CurrentEdgeType } from '$lib/types/components.js';
import type { Writable } from 'svelte/store';

export function port(
    node: HTMLElement,
    { currentEdge }: { currentEdge: Writable<CurrentEdgeType | null> }
) {
    const { x, y } = node.getBoundingClientRect();
    const id = node.id;
    const pId = node.parentElement?.id;
    let startX = x;
    let startY: number = y;

    function handleMousedown(event: MouseEvent) {
        event.stopPropagation();
        // Calculate the start position of the edge
        startX = event.clientX;
        startY = event.clientY;

        // Set the current edge in the store
        currentEdge.set({ startX, startY, endX: startX, endY: startY });

        // Add mousemove and mouseup event listeners
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(event: MouseEvent) {
        event.stopPropagation();
        // Update the end position of the edge in the store
        currentEdge.update((edge: any) => {
            if (edge) {
                return { ...edge, endX: event.clientX, endY: event.clientY };
            }
            return edge;
        });
    }

    function handleMouseup(event: MouseEvent) {
        event.stopPropagation();
        // Remove the current edge from the store
        currentEdge.set(null);

        // Remove mousemove and mouseup event listeners
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);
    }

    // Add the mousedown event listener to the node
    node.addEventListener('mousedown', handleMousedown);

    return {
        destroy() {
            // Remove the mousedown event listener from the node
            node.removeEventListener('mousedown', handleMousedown);
        },
    };
}
