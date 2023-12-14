export enum Direction {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left',
}

export type Position = {
    x: number;
    y: number;
};

export type CurrentEdgeType = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};
