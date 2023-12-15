import type { Writable, Readable } from 'svelte/store';
import type { CurrentEdgeType, Direction } from '$lib/types/components.js';

export interface SettingsType {
    theme: string;
}

export interface ViewportType {
    x: number;
    y: number;
    width: number | undefined;
    height: number | undefined;
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
    sourceDirection?: Direction;
    target: string;
    targetHandle?: string;
    targetDirection?: Direction;
    markerStart?: string;
    markerEnd?: string;
    style?: string;
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
    currentEdge: Writable<CurrentEdgeType | null>;
}
