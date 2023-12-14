import type { Writable, Readable } from "svelte/store";

export interface SettingsType {
    theme: Writable<string>;
}

export interface ViewportType {
    x: Writable<number>;
    y: Writable<number>;
    width: Writable<number>;
    height: Writable<number>;
    scale: Writable<number>;
}

export interface NodeType {
    id: string;
    type: string;
    transform: {
        x: number;
        y: number;
        height: number;
        width: number;
    },
    data: any;
}

export interface EdgeType {
    id: string;
    data: any;
    source: string;
    target: string;
}

export interface UserStoreType {
    settings?: SettingsType;
    viewport?: ViewportType;
    nodes?: NodeType[];
    edges?: EdgeType[];
}

export interface StoreType {
    settingsStore: Writable<SettingsType>;
    viewportStore: Writable<ViewportType>;
    nodesStore: Writable<NodeType[]>;
    edgesStore: Writable<EdgeType[]>;
    selectedNodes: Writable<string[]>;
    historyStore: Writable<any[]>;
    scaleStore: Readable<number>;
}