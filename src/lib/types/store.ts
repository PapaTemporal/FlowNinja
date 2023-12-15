import type { Writable, Readable } from 'svelte/store';

export interface SettingsType {
    theme: Writable<string>;
}

export interface ViewportType {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    scaleExtents: number[];
}

export interface NodeType {
    id: string;
    type: string;
    transform: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
    data: any;
}

export interface EdgeType {
    id: string;
    type: string;
    source: string;
    sourceHandle?: string;
    target: string;
    targetHandle?: string;
    style?: string;
}

export interface UserStoreType {
    settings?: SettingsType;
    viewport?: ViewportType;
    nodes?: NodeType[];
    edges?: EdgeType[];
}

export interface StoreType {
    settingsStore: SettingsType;
    viewportStore: Writable<ViewportType>;
    nodesStore: Writable<NodeType[]>;
    edgesStore: Writable<EdgeType[]>;
    selectedNodes: Writable<string[]>;
    historyStore: Writable<any[]>;
    scaleStore: Readable<number>;
}
