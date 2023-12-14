<script lang="ts">
  import BaseEdge from "./BaseEdge.svelte";
  import { getSmoothStepPath } from "$lib/utils";
  import { v4 as uuidv4 } from "uuid";

  export let id = uuidv4();
  export let sourceX: number;
  export let sourceY: number;
  export let targetX: number;
  export let targetY: number;
  export let sourceDirection: number;
  export let targetDirection: number;
  export let markerStart: string;
  export let markerEnd: string;
  export let style: string;

  $: [path, labelX, labelY] = getSmoothStepPath({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
    sourceDirection: sourceDirection,
    targetDirection: targetDirection,
    borderRadius: 0,
  });
</script>

<BaseEdge {id} {path} {markerStart} {markerEnd} {style} />
