"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderResult = void 0;
class RenderResult {
    constructor(width, height, baseline, svgContent) {
        this.width = width;
        this.height = height;
        this.baseline = baseline;
        this.svgContent = svgContent;
    }
    get leftConnection() {
        return { x: 0, y: this.baseline };
    }
    get rightConnection() {
        return { x: this.width, y: this.baseline };
    }
    getConnectionPoints() {
        return {
            left: this.leftConnection,
            right: this.rightConnection
        };
    }
}
exports.RenderResult = RenderResult;
//# sourceMappingURL=render-result.js.map