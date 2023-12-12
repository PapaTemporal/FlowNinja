<script lang="ts">
    export let node: any;

    const { x, y, height, width } = node;
</script>

<div
    class="node"
    style={`height: ${height}; width: ${width}; top: ${y}px; left: ${x}px;`}
>
    I am a default node
</div>

<style>
    .node {
        position: absolute;
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 5px;
        padding: 10px;
    }
</style>
