<script lang="ts">
    import { zoom } from "$lib/actions";
    import { getContext } from "svelte";

    const scale = getContext("scale");
    const scaleExtents = getContext("scaleExtents");
</script>

<div
    class="zoomer"
    use:zoom={{
        scale,
        min: $scaleExtents.min,
        max: $scaleExtents.max,
    }}
>
    <slot />
</div>

<style>
    .zoomer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        transform-origin: top left;
        transition: transform 0.2s ease-in-out;
    }
</style>
