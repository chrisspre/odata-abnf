import { Point } from './common.js';
export interface LayoutResult {
    width: number;
    height: number;
    baseline: number;
    svgContent: string;
    connectorLeft: Point;
    connectorRight: Point;
    connectionPaths?: string[];
    overlayElements?: string[];
}
//# sourceMappingURL=layout-result.d.ts.map