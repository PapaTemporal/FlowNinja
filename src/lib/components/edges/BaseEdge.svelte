<script lang="ts">
    export let id: string;
    export let path: string;
    export let markerStart: string;
    export let markerEnd: string;
    export let style: string;
</script>

<path
    {id}
    d={path}
    marker-start={markerStart}
    marker-end={markerEnd}
    fill="none"
    {style}
    stroke="#b1b1b7"
    stroke-width="2"
/>
