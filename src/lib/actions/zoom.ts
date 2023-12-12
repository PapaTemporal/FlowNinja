import type { Writable } from "svelte/store";

export function zoom(node: HTMLElement, { scale }: { scale: Writable<number> }) {
    let currentScale: number;

    const unsubscribe = scale.subscribe(value => {
        currentScale = value;
        node.style.transform = `scale(${currentScale})`;
    });

    return {
        destroy() {
            unsubscribe();
        }
    };
}