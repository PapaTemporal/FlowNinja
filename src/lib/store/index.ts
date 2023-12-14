import { writable, type Writable, derived } from "svelte/store";
import { v4 as uuidv4 } from 'uuid';
import type { SettingsType, ViewportType, NodeType, EdgeType, UserStoreType, StoreType, } from "./types";
import type { CurrentEdgeType } from "$lib/types/components.js";

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

export const createStore = ({ settings, viewport, nodes, edges }: UserStoreType) => {
    const key = uuidv4();

    // Global settings store (public)
    const settingsStore: SettingsType = { theme: writable(settings?.theme ?? settingsDefaults.theme) };

    // Viewport store (public)
    const viewportStore: ViewportType = {
        x: writable(viewport?.x ?? viewportDefaults.x),
        y: writable(viewport?.y ?? viewportDefaults.y),
        width: writable(viewport?.width ?? viewportDefaults.width),
        height: writable(viewport?.height ?? viewportDefaults.height),
        scale: writable(viewport?.scale ?? viewportDefaults.scale),
        scaleExtents: writable(viewport?.scaleExtents ?? viewportDefaults.scaleExtents),
    };

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

    nodesStore.set(nodes);
    edgesStore.set(edges);

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
}