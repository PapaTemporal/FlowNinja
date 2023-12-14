<script lang="ts">
    import { getContext } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { Direction } from '$lib/types';
    import { port } from '$lib/actions';

    export let id = uuidv4();
    export let type = 'source';
    export let direction = Direction.Right;
    export let style = '';

    let currentEdge = getContext('currentEdge');
</script>

<div {style} class="connector" use:port={{ currentEdge }} />

<style>
    .connector {
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        border: 2px solid #000;
        cursor: pointer;
        z-index: 1;
    }
</style>
