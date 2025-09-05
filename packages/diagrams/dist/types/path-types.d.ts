export interface Point {
    x: number;
    y: number;
}
export declare class RenderResult {
    readonly width: number;
    readonly height: number;
    readonly baseline: number;
    readonly svgContent: string;
    constructor(width: number, height: number, baseline: number, svgContent: string);
    get leftConnection(): Point;
    get rightConnection(): Point;
    getConnectionPoints(): {
        left: Point;
        right: Point;
    };
}
//# sourceMappingURL=path-types.d.ts.map