import type { Writable } from 'svelte/store';

export function panzoom(
    node: HTMLElement,
    {
        x,
        y,
        height,
        width,
        scale,
        scaleExtents,
    }: {
        x: Writable<number>,
        y: Writable<number>,
        height: Writable<number>,
        width: Writable<number>,
        scale: Writable<number>,
        scaleExtents: Writable<number[]>
    },
) {
    let lastX: number
    let lastY: number;
    let dragging = false;
    let localScale: number;
    let translateX: number;
    let translateY: number;
    let localScaleExtents: number[];
    let localHeight: number;
    let localWidth: number;
    let pWidth: number;
    let pHeight: number;
    let translateExtents: {
        min: [number, number];
        max: [number, number];
    };
    let viewportElement = node.parentElement;
    if (viewportElement) {
        const bbox = viewportElement.getBoundingClientRect();
        pWidth = bbox.width;
        pHeight = bbox.height;
    }
    node.style.transformOrigin = 'top left';

    const unsubscribeHeight = height.subscribe(value => {
        localHeight = value;

        if (!localHeight || localHeight < pHeight) {
            localHeight = pHeight * 4;
        }

        node.style.height = `${localHeight}px`;
    });

    const unsubscribeWidth = width.subscribe(value => {
        localWidth = value;

        if (!localWidth || localWidth < pWidth) {
            localWidth = pWidth * 4;
        }

        node.style.width = `${localWidth}px`;
    });

    const unsubscribeScale = scale.subscribe(value => {
        localScale = value;
    });

    const unsubscribeX = x.subscribe(value => {
        translateX = value;

        if (!translateX) {
            translateX = -localWidth / 2 + pWidth / 2 / localScale;
        }

        translateExtents = {
            min: [-localWidth + pWidth, -localHeight + pHeight],
            max: [0, 0],
        };
    });

    const unsubscribeY = y.subscribe(value => {
        translateY = value;

        if (!translateY) {
            translateY = -localHeight / 2 + pHeight / 2 / localScale;
        }

        translateExtents = {
            min: [-localWidth + pWidth, -localHeight + pHeight],
            max: [0, 0],
        };
    });

    const unsubscribeScaleExtents = scaleExtents.subscribe(value => {
        localScaleExtents = value;
    });

    function handleMousedown(event: MouseEvent) {
        event.preventDefault();

        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);

        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }

    function handleMousemove(event: MouseEvent) {
        event.preventDefault();

        if (dragging) {
            let newTranslateX = translateX + (event.clientX - lastX) / localScale;
            let newTranslateY = translateY + (event.clientY - lastY) / localScale;

            // Clamp translation to the translateExtents
            newTranslateX = Math.max(
                Math.min(newTranslateX, translateExtents.max[0]),
                translateExtents.min[0]
            );
            newTranslateY = Math.max(
                Math.min(newTranslateY, translateExtents.max[1]),
                translateExtents.min[1]
            );

            translateX = newTranslateX;
            translateY = newTranslateY;

            lastX = event.clientX;
            lastY = event.clientY;

            node.style.transform = `scale(${localScale}) translate(${translateX}px, ${translateY}px);`

        }
    }

    function handleMouseup(event: MouseEvent) {
        event.preventDefault();

        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);

        dragging = false;
    }

    function handleWheel(event: {
        preventDefault: () => void;
        deltaY: number;
    }) {
        event.preventDefault();

        localScale = Math.max(
            localScaleExtents[0],
            Math.min(
                localScaleExtents[1],
                localScale * (event.deltaY > 0 ? 1.1 : 0.9)
            )
        )

        translateExtents = {
            min: [-localWidth + pWidth / localScale, -localHeight + pHeight / localScale],
            max: [0, 0],
        };

        translateX = Math.max(
            Math.min(translateX, translateExtents.max[0]),
            translateExtents.min[0]
        )

        translateY = Math.max(
            Math.min(translateY, translateExtents.max[1]),
            translateExtents.min[1]
        )

        node.style.transform = `scale(${localScale}) translate(${translateX}px, ${translateY}px);`
    }

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('wheel', handleWheel, { passive: false });

    return {
        destroy() {
            unsubscribeScale();
            unsubscribeScaleExtents();
            unsubscribeX();
            unsubscribeY();
            unsubscribeHeight();
            unsubscribeWidth();
            node.removeEventListener('mousedown', handleMousedown);
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
            node.removeEventListener('wheel', handleWheel);
        },
    };
}