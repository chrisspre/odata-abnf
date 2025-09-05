import { Point } from './common.js';
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
//# sourceMappingURL=render-result.d.ts.map