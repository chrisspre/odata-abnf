"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathBuilder = void 0;
class PathBuilder {
    constructor(strokeWidth = 5, cornerRadius = 12) {
        this.strokeWidth = strokeWidth;
        this.cornerRadius = cornerRadius;
    }
    createHorizontalPath(fromX, toX, y) {
        return `<path d="M ${fromX} ${y} L ${toX} ${y}" fill="none" stroke="#333" stroke-width="${this.strokeWidth}"/>`;
    }
    createRectilinearPath(from, to) {
        if (from.y === to.y) {
            return `<path d="M ${from.x} ${from.y} L ${to.x} ${to.y}" fill="none" stroke="#333" stroke-width="${this.strokeWidth}"/>`;
        }
        const verticalDistance = Math.abs(to.y - from.y);
        if (verticalDistance < this.cornerRadius) {
            return `<path d="M ${from.x} ${from.y} L ${to.x} ${to.y}" fill="none" stroke="#333" stroke-width="${this.strokeWidth}"/>`;
        }
        const midX = (from.x + to.x) / 2;
        return `<path d="M ${from.x} ${from.y} L ${midX - this.cornerRadius} ${from.y} Q ${midX} ${from.y} ${midX} ${from.y + (to.y > from.y ? this.cornerRadius : -this.cornerRadius)} L ${midX} ${to.y + (to.y > from.y ? -this.cornerRadius : this.cornerRadius)} Q ${midX} ${to.y} ${midX + this.cornerRadius} ${to.y} L ${to.x} ${to.y}" fill="none" stroke="#333" stroke-width="${this.strokeWidth}"/>`;
    }
    createBypassPath(leftConnection, rightConnection, childBaseline, isAbove) {
        const bypassY = childBaseline + (isAbove ? -this.cornerRadius * 2 : this.cornerRadius * 2);
        const padding = this.cornerRadius;
        return `<path d="M ${leftConnection.x} ${leftConnection.y} L ${leftConnection.x + padding} ${leftConnection.y} Q ${leftConnection.x + padding + this.cornerRadius} ${leftConnection.y} ${leftConnection.x + padding + this.cornerRadius} ${bypassY} L ${rightConnection.x - padding - this.cornerRadius} ${bypassY} Q ${rightConnection.x - padding} ${bypassY} ${rightConnection.x - padding} ${rightConnection.y} L ${rightConnection.x} ${rightConnection.y}" fill="none" stroke="#333" stroke-width="${this.strokeWidth}"/>`;
    }
    createLoopPath(leftConnection, rightConnection, childBaseline, isAbove) {
        const loopY = childBaseline + (isAbove ? -this.cornerRadius * 3 : this.cornerRadius * 3);
        const padding = this.cornerRadius;
        return `<path d="M ${rightConnection.x} ${rightConnection.y} L ${rightConnection.x + padding} ${rightConnection.y} Q ${rightConnection.x + padding + this.cornerRadius} ${rightConnection.y} ${rightConnection.x + padding + this.cornerRadius} ${loopY} L ${leftConnection.x - padding - this.cornerRadius} ${loopY} Q ${leftConnection.x - padding} ${loopY} ${leftConnection.x - padding} ${leftConnection.y} L ${leftConnection.x} ${leftConnection.y}" fill="none" stroke="#333" stroke-width="${this.strokeWidth}"/>`;
    }
    createStackConnections(parentLeft, parentRight, childConnections) {
        const paths = [];
        for (const child of childConnections) {
            paths.push(this.createRectilinearPath(parentLeft, child.left));
            paths.push(this.createRectilinearPath(child.right, parentRight));
        }
        return paths;
    }
    isValidChildPosition(parentY, childY) {
        const distance = Math.abs(childY - parentY);
        return distance === 0 || distance >= this.cornerRadius;
    }
}
exports.PathBuilder = PathBuilder;
//# sourceMappingURL=path-builder.js.map