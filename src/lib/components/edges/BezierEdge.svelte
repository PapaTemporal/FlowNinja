<script lang="ts">
  import BaseEdge from "./BaseEdge.svelte";
  import { getBezierPath } from "$lib/utils";
  import { v4 as uuidv4 } from "uuid";
  import type { EdgeType, NodeType } from "$lib/types";

  export let id = uuidv4();
  export let edge: EdgeType;
  export let sourceNode: NodeType;
  export let targetNode: NodeType;
  export let style = "";

  let { x: sourceX, y: sourceY } = sourceNode;
  let { x: targetX, y: targetY } = targetNode;

  console.log(sourceX, sourceY, targetX, targetY);

  $: [path, labelX, labelY] = getBezierPath({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
    sourceDirection: edge.sourceDirection,
    targetDirection: edge.targetDirection,
  });
</script>

<BaseEdge
  {id}
  {path}
  markerStart={edge.markerStart}
  markerEnd={edge.markerEnd}
  {style}
/>
