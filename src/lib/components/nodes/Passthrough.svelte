<script lang="ts">
    import { Dot } from '$lib/components/ports/index.js';
    import { Direction } from '$lib/types/index.js';

    export let id: string;
    export let type: string;
    export let transform: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
    export let data: any;
    export let updateData: (id: string, data: any) => void;
</script>

<div class="node row">
    <Dot id={`${id}__a`} type="target" direction={Direction.Left} />
    I am default node {id}
    <Dot id={`${id}__b`} />
</div>

<style>
    .node {
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        padding: 10px;
    }
    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
