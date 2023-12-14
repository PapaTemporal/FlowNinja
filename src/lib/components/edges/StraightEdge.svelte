<script lang="ts">
  import BaseEdge from "./BaseEdge.svelte";
  import { getStraightPath } from "$lib/utils";
  import { v4 as uuidv4 } from "uuid";

  export let id = uuidv4();
  export let sourceX: number;
  export let sourceY: number;
  export let targetX: number;
  export let targetY: number;
  export let markerStart: string;
  export let markerEnd: string;
  export let style: string;

  $: [path, labelX, labelY] = getStraightPath({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
  });
</script>

<BaseEdge {id} {path} {markerStart} {markerEnd} {style} />
