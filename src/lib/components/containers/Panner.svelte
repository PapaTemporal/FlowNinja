<script lang="ts">
    import { pan } from "$lib/actions";
</script>

<div class="panner" use:pan>
    <slot />
</div>

<style>
    .panner {
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            white;
        background-size: 30px 30px;
        transform-origin: top left;
    }
</style>
