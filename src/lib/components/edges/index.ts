import BezierEdge from './BezierEdge.svelte';
import StraightEdge from './StraightEdge.svelte';
import SmoothStepEdge from './SmoothStepEdge.svelte';
import StepEdge from './StepEdge.svelte';

const edgeTypes = {
    default: BezierEdge,
    bezier: BezierEdge,
    straight: StraightEdge,
    smoothstep: SmoothStepEdge,
    step: StepEdge,
};

export { edgeTypes };
