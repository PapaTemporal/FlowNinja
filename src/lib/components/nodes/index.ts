import Passthrough from './Passthrough.svelte';
import Start from './Start.svelte';
import End from './End.svelte';

const nodeTypes = {
    default: Passthrough,
    passthrough: Passthrough,
    start: Start,
    end: End,
};

export { nodeTypes };
