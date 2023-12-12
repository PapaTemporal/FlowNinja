import { writable } from "svelte/store";
export * from './constants';

// Global settings store
export const settingsStore = writable({
    theme: 'light',
    // other settings...
});

// Flow store
export const flowStore = writable({
    nodes: [],
    edges: [],
});

// Selected nodes store
export const selectedNodes = writable([]);

// History store
export const historyStore = writable([]);

// viewport scale store
export const scaleStore = writable(1);
export const stepScaleStore = writable(0.25);