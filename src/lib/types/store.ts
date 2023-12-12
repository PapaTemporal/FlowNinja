import type { Writable } from "svelte/store";

export interface ScaleExtents {
    min: number;
    max: number;
}

export interface Node {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
}

export interface Edge {
    id: string;
    source: string;
    target: string;
    label: string;
}

export interface FlowStore {
    id: Writable<string>;
    name: Writable<string>;
    scale: Writable<number>;
    step: Writable<number>;
    scaleExtents: ScaleExtents;
    nodes: Writable<Node[]>;
    edges: Writable<Edge[]>;
    nodeTypes?: { [key: string]: any };
    [key: string]: any;
}