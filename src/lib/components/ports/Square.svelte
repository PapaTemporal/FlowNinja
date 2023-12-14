<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import { Direction } from '$lib/types';

    export let id = uuidv4();
    export let type = 'source';
    export let direction = Direction.Right;
</script>

<div class="connector" />

<style>
    .connector {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #fff;
        border: 2px solid #000;
        cursor: pointer;
        z-index: 1;
    }
</style>
