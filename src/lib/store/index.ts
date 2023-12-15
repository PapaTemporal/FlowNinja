import { writable, type Writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type {
    SettingsType,
    ViewportType,
    NodeType,
    EdgeType,
    UserStoreType,
    StoreType,
} from '$lib/types/index.js';
import type { CurrentEdgeType } from '$lib/types/components.js';

let stores: { [key: string]: StoreType } = {};

const settingsDefaults: SettingsType = {
    theme: 'light',
};

const viewportDefaults: ViewportType = {
    x: 0,
    y: 0,
    width: undefined,
    height: undefined,
    scale: 1,
    scaleExtents: [0.5, 1.5],
};

export const createStore = ({
    settings,
    viewport,
    nodes,
    edges,
}: UserStoreType) => {
    const key = uuidv4();

    // Global settings store (public)
    const settingsStore: Writable<SettingsType> = writable({
        theme: settings?.theme ?? settingsDefaults.theme,
    });

    // Viewport store (public)
    const viewportStore: Writable<ViewportType> = writable({
        x: viewport?.x ?? viewportDefaults.x,
        y: viewport?.y ?? viewportDefaults.y,
        width: viewport?.width ?? viewportDefaults.width,
        height: viewport?.height ?? viewportDefaults.height,
        scale: viewport?.scale ?? viewportDefaults.scale,
        scaleExtents: viewport?.scaleExtents ?? viewportDefaults.scaleExtents,
    });

    // Flow store (array of nodes and edges - public)
    const nodesStore: Writable<NodeType[]> = writable(nodes || []);

    // Flow store (array of nodes and edges - public)
    const edgesStore: Writable<EdgeType[]> = writable(edges || []);

    // Selected nodes store (array of node ids - private)
    const selectedNodes: Writable<string[]> = writable([]);

    // History store (array of actions - private)
    const historyStore: Writable<any[]> = writable([]);

    // Create a writable store to hold the current edge
    const currentEdge: Writable<CurrentEdgeType | null> = writable(null);

    stores[key] = {
        settingsStore,
        viewportStore,
        nodesStore,
        edgesStore,
        selectedNodes,
        historyStore,
        currentEdge,
    };

    return { key, store: stores[key] };
};
