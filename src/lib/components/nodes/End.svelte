<script lang="ts">
    import { pan } from "../../actions";
    export let node: any;
</script>

<div id={node.id} class="node" use:pan={{ ...node, scale: $$props.scale }}>
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
