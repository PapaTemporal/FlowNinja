import { Direction } from '$lib/types';

export type GetBezierPathParams = {
    sourceX: number;
    sourceY: number;
    sourceDirection?: Direction;
    targetX: number;
    targetY: number;
    targetDirection?: Direction;
    curvature?: number;
};

export type GetControlWithCurvatureParams = {
    pos: Direction;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    c: number;
};

export function getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
}: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourceControlX: number;
    sourceControlY: number;
    targetControlX: number;
    targetControlY: number;
}): [number, number, number, number] {
    // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
    // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
    const centerX =
        sourceX * 0.125 +
        sourceControlX * 0.375 +
        targetControlX * 0.375 +
        targetX * 0.125;
    const centerY =
        sourceY * 0.125 +
        sourceControlY * 0.375 +
        targetControlY * 0.375 +
        targetY * 0.125;
    const offsetX = Math.abs(centerX - sourceX);
    const offsetY = Math.abs(centerY - sourceY);

    return [centerX, centerY, offsetX, offsetY];
}

function calculateControlOffset(distance: number, curvature: number): number {
    if (distance >= 0) {
        return 0.5 * distance;
    }

    return curvature * 25 * Math.sqrt(-distance);
}

function getControlWithCurvature({
    pos,
    x1,
    y1,
    x2,
    y2,
    c,
}: GetControlWithCurvatureParams): [number, number] {
    switch (pos) {
        case Direction.Left:
            return [x1 - calculateControlOffset(x1 - x2, c), y1];
        case Direction.Right:
            return [x1 + calculateControlOffset(x2 - x1, c), y1];
        case Direction.Top:
            return [x1, y1 - calculateControlOffset(y1 - y2, c)];
        case Direction.Bottom:
            return [x1, y1 + calculateControlOffset(y2 - y1, c)];
    }
}

export function getBezierPath({
    sourceX,
    sourceY,
    sourceDirection = Direction.Bottom,
    targetX,
    targetY,
    targetDirection = Direction.Top,
    curvature = 0.25,
}: GetBezierPathParams): [
    path: string,
    labelX: number,
    labelY: number,
    offsetX: number,
    offsetY: number,
] {
    const [sourceControlX, sourceControlY] = getControlWithCurvature({
        pos: sourceDirection,
        x1: sourceX,
        y1: sourceY,
        x2: targetX,
        y2: targetY,
        c: curvature,
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
        pos: targetDirection,
        x1: targetX,
        y1: targetY,
        x2: sourceX,
        y2: sourceY,
        c: curvature,
    });
    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourceControlX,
        sourceControlY,
        targetControlX,
        targetControlY,
    });

    return [
        `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
        labelX,
        labelY,
        offsetX,
        offsetY,
    ];
}
