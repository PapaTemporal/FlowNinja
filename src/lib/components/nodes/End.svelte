<script lang="ts">
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

<div class="node">
    I am end node {id}
</div>

<style>
    .node {
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        padding: 10px;
    }
</style>
