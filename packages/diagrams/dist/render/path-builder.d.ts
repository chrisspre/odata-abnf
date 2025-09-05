import { Point } from '../types/common.js';
export declare class PathBuilder {
    private strokeWidth;
    private cornerRadius;
    constructor(strokeWidth?: number, cornerRadius?: number);
    createHorizontalPath(fromX: number, toX: number, y: number): string;
    createRectilinearPath(from: Point, to: Point): string;
    createBypassPath(leftConnection: Point, rightConnection: Point, childBaseline: number, isAbove: boolean): string;
    createLoopPath(leftConnection: Point, rightConnection: Point, childBaseline: number, isAbove: boolean): string;
    createStackConnections(parentLeft: Point, parentRight: Point, childConnections: {
        left: Point;
        right: Point;
    }[]): string[];
    isValidChildPosition(parentY: number, childY: number): boolean;
}
//# sourceMappingURL=path-builder.d.ts.map