import type { Writable } from "svelte/store";

export interface ZoomOptions {
    scale: Writable<number>;
    min: number;
    max: number;
    step: number;
}