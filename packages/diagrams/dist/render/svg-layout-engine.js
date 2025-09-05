"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGLayoutEngine = void 0;
class SVGLayoutEngine {
    constructor(options = {}) {
        this.options = {
            width: 800,
            height: 600,
            padding: 20,
            strokeWidth: 5,
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            cornerRadius: 16,
            minRailWidth: 40,
            debug: false,
            terminalStyle: {
                fill: '#f0f0f0',
                stroke: '#333',
                fontWeight: 'bold',
            },
            nonterminalStyle: {
                fill: '#e0e0e0',
                stroke: '#333',
                fontWeight: 'normal',
            },
            ...options,
        };
    }
    layout(expression) {
        const result = this.layoutExpression(expression, 0, 0);
        if (this.options.debug) {
            result.svgContent = result.svgContent + this.createDebugVisualization(result.width, result.height, result.baseline, 0, 0);
        }
        return result;
    }
    layoutRuleRightHandSide(expression) {
        const coreResult = this.layout(expression);
        const leadLength = 30;
        const sideMargin = 20;
        const circleRadius = Math.max(this.options.strokeWidth * 1.5, 6);
        const debugCircleRadius = this.options.debug ? 3 : circleRadius;
        const circleColor = this.options.debug ? 'hotpink' : '#333';
        const totalWidth = coreResult.width + (leadLength * 2) + (sideMargin * 2);
        const totalHeight = coreResult.height + 40;
        const adjustedBaseline = coreResult.baseline + 20;
        const startConnector = `<circle cx="${sideMargin}" cy="${adjustedBaseline}" r="${debugCircleRadius}" fill="${circleColor}"/>`;
        const endConnector = `<circle cx="${totalWidth - sideMargin}" cy="${adjustedBaseline}" r="${debugCircleRadius}" fill="${circleColor}"/>`;
        const startLeadPath = `<path d="M ${sideMargin} ${adjustedBaseline} L ${sideMargin + leadLength} ${adjustedBaseline}" 
             fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`;
        const startPath = coreResult.connectorLeft ?
            `<path d="M ${sideMargin + leadLength} ${adjustedBaseline} L ${coreResult.connectorLeft.x + sideMargin + leadLength} ${coreResult.connectorLeft.y + 20}" 
             fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>` : '';
        const endPath = coreResult.connectorRight ?
            `<path d="M ${coreResult.connectorRight.x + sideMargin + leadLength} ${coreResult.connectorRight.y + 20} L ${totalWidth - sideMargin - leadLength} ${adjustedBaseline}" 
             fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>` : '';
        const endLeadPath = `<path d="M ${totalWidth - sideMargin - leadLength} ${adjustedBaseline} L ${totalWidth - sideMargin} ${adjustedBaseline}" 
             fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`;
        const completeSvg = `<g transform="translate(${sideMargin + leadLength}, 20)">
        ${coreResult.svgContent}
    </g>
    ${startConnector}
    ${endConnector}
    ${startLeadPath}
    ${startPath}
    ${endPath}
    ${endLeadPath}`;
        const finalSvg = this.options.debug ?
            completeSvg + this.createDebugVisualization(totalWidth, totalHeight, adjustedBaseline, 0, 0) :
            completeSvg;
        return {
            width: totalWidth,
            height: totalHeight,
            baseline: adjustedBaseline,
            svgContent: finalSvg,
            connectorLeft: { x: sideMargin, y: adjustedBaseline },
            connectorRight: { x: totalWidth - sideMargin, y: adjustedBaseline },
        };
    }
    getStrokeWidth() {
        return this.options.strokeWidth;
    }
    layoutExpression(expression, x, y) {
        let contentResult;
        switch (expression.type) {
            case 'terminal':
                contentResult = this.layoutTerminalContent(expression);
                break;
            case 'nonterminal':
                contentResult = this.layoutNonterminalContent(expression);
                break;
            case 'inline':
                contentResult = this.layoutInlineContent(expression);
                break;
            case 'stack':
                contentResult = this.layoutStackContent(expression);
                break;
            case 'bypass':
                contentResult = this.layoutBypassContent(expression);
                break;
            case 'loop':
                contentResult = this.layoutLoopContent(expression);
                break;
            case 'group':
                contentResult = this.layoutGroupContent(expression);
                break;
            default:
                throw new Error(`Unknown expression type: ${expression.type}`);
        }
        const groupSvg = `<g transform="translate(${x}, ${y})" class="${expression.type}-node">${contentResult.svgContent}</g>`;
        return {
            width: contentResult.width,
            height: contentResult.height,
            baseline: y + contentResult.baseline,
            svgContent: groupSvg,
            connectorLeft: { x: x + contentResult.connectorLeft.x, y: y + contentResult.connectorLeft.y },
            connectorRight: { x: x + contentResult.connectorRight.x, y: y + contentResult.connectorRight.y },
        };
    }
    layoutTerminalContent(expression) {
        const rawText = expression.value === ' ' ? '\u00A0' : (expression.value || '');
        const text = `"${rawText}"`;
        const textWidth = this.measureText(text);
        const boxWidth = textWidth + this.options.padding;
        const boxHeight = this.options.fontSize + this.options.padding;
        const baseline = boxHeight / 2;
        const totalWidth = Math.max(boxWidth + this.options.minRailWidth, boxWidth);
        const railPadding = (totalWidth - boxWidth) / 2;
        const boxX = railPadding;
        const textY = boxHeight / 2;
        const svgContent = [
            this.createRoundedRect(boxX, 0, boxWidth, boxHeight, this.options.terminalStyle),
            this.createText(boxX + boxWidth / 2, textY, text, {
                textAnchor: 'middle',
                dominantBaseline: 'central',
                fontWeight: this.options.terminalStyle.fontWeight,
            }),
        ];
        if (railPadding > 0) {
            svgContent.push(`<path d="M 0 ${baseline} L ${boxX} ${baseline} M ${boxX + boxWidth} ${baseline} L ${totalWidth} ${baseline}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`);
        }
        else {
            svgContent.push(`<path d="M 0 ${baseline} L ${boxX} ${baseline}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`);
            svgContent.push(`<path d="M ${boxX + boxWidth} ${baseline} L ${totalWidth} ${baseline}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`);
        }
        return {
            width: totalWidth,
            height: boxHeight,
            baseline,
            svgContent: this.wrapWithDebug(svgContent.join(''), totalWidth, boxHeight, baseline),
            connectorLeft: { x: 0, y: baseline },
            connectorRight: { x: totalWidth, y: baseline },
        };
    }
    layoutNonterminalContent(expression) {
        const text = expression.value || '';
        const textWidth = this.measureText(text);
        const boxWidth = textWidth + this.options.padding;
        const boxHeight = this.options.fontSize + this.options.padding;
        const baseline = boxHeight / 2;
        const totalWidth = Math.max(boxWidth + this.options.minRailWidth, boxWidth);
        const railPadding = (totalWidth - boxWidth) / 2;
        const boxX = railPadding;
        const textY = boxHeight / 2;
        const svgContent = [
            this.createRoundedRect(boxX, 0, boxWidth, boxHeight, this.options.nonterminalStyle),
            this.createText(boxX + boxWidth / 2, textY, text, {
                textAnchor: 'middle',
                dominantBaseline: 'central',
                fontWeight: this.options.nonterminalStyle.fontWeight,
                cursor: 'pointer',
                'data-nonterminal': expression.value,
            }),
        ];
        if (railPadding > 0) {
            svgContent.push(`<path d="M 0 ${baseline} L ${boxX} ${baseline} M ${boxX + boxWidth} ${baseline} L ${totalWidth} ${baseline}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`);
        }
        else {
            svgContent.push(`<path d="M 0 ${baseline} L ${boxX} ${baseline}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`);
            svgContent.push(`<path d="M ${boxX + boxWidth} ${baseline} L ${totalWidth} ${baseline}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`);
        }
        return {
            width: totalWidth,
            height: boxHeight,
            baseline,
            svgContent: this.wrapWithDebug(svgContent.join(''), totalWidth, boxHeight, baseline),
            connectorLeft: { x: 0, y: baseline },
            connectorRight: { x: totalWidth, y: baseline },
        };
    }
    layoutInlineContent(expression) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return {
                width: 0,
                height: 0,
                baseline: 0,
                svgContent: '',
                connectorLeft: { x: 0, y: 0 },
                connectorRight: { x: 0, y: 0 },
            };
        }
        const childResults = [];
        for (const element of elements) {
            let result;
            switch (element.type) {
                case 'terminal':
                    result = this.layoutTerminalContent(element);
                    break;
                case 'nonterminal':
                    result = this.layoutNonterminalContent(element);
                    break;
                case 'inline':
                    result = this.layoutInlineContent(element);
                    break;
                case 'stack':
                    result = this.layoutStackContent(element);
                    break;
                case 'bypass':
                    result = this.layoutBypassContent(element);
                    break;
                case 'loop':
                    result = this.layoutLoopContent(element);
                    break;
                case 'group':
                    result = this.layoutGroupContent(element);
                    break;
                default:
                    throw new Error(`Unknown expression type: ${element.type}`);
            }
            childResults.push(result);
        }
        const commonBaseline = Math.max(...childResults.map(r => r.baseline));
        let currentX = 0;
        const svgParts = [];
        for (let i = 0; i < childResults.length; i++) {
            const child = childResults[i];
            const childY = commonBaseline - child.baseline;
            const translatedSvg = `<g transform="translate(${currentX}, ${childY})">${child.svgContent}</g>`;
            svgParts.push(translatedSvg);
            if (i < childResults.length - 1) {
                const lineStart = { x: currentX + child.width, y: commonBaseline };
                const lineEnd = { x: currentX + child.width + this.options.padding, y: commonBaseline };
                svgParts.push(this.createPath([lineStart, lineEnd]));
            }
            currentX += child.width + this.options.padding;
        }
        const totalWidth = currentX - this.options.padding;
        const minY = Math.min(...childResults.map(r => commonBaseline - r.baseline));
        const maxY = Math.max(...childResults.map(r => commonBaseline - r.baseline + r.height));
        const totalHeight = maxY - minY;
        return {
            width: totalWidth,
            height: totalHeight,
            baseline: commonBaseline,
            svgContent: this.wrapWithDebug(svgParts.join(''), totalWidth, totalHeight, commonBaseline),
            connectorLeft: { x: 0, y: commonBaseline },
            connectorRight: { x: totalWidth, y: commonBaseline },
        };
    }
    layoutStackContent(expression) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return {
                width: 0,
                height: 0,
                baseline: 0,
                svgContent: '',
                connectorLeft: { x: 0, y: 0 },
                connectorRight: { x: 0, y: 0 },
            };
        }
        let maxWidth = 0;
        let totalHeight = 0;
        const results = [];
        for (const element of elements) {
            let result;
            switch (element.type) {
                case 'terminal':
                    result = this.layoutTerminalContent(element);
                    break;
                case 'nonterminal':
                    result = this.layoutNonterminalContent(element);
                    break;
                case 'inline':
                    result = this.layoutInlineContent(element);
                    break;
                case 'stack':
                    result = this.layoutStackContent(element);
                    break;
                case 'bypass':
                    result = this.layoutBypassContent(element);
                    break;
                case 'loop':
                    result = this.layoutLoopContent(element);
                    break;
                case 'group':
                    result = this.layoutGroupContent(element);
                    break;
                default:
                    throw new Error(`Unknown expression type: ${element.type}`);
            }
            results.push(result);
            maxWidth = Math.max(maxWidth, result.width);
            totalHeight += result.height + this.options.padding;
        }
        totalHeight += this.options.padding;
        maxWidth += this.options.padding * 4;
        let externalBaseline;
        if (results.length % 2 === 1) {
            const middleIndex = Math.floor(results.length / 2);
            let middleY = this.options.padding;
            for (let i = 0; i < middleIndex; i++) {
                middleY += results[i].height + this.options.padding;
            }
            externalBaseline = middleY + results[middleIndex].baseline;
        }
        else {
            externalBaseline = totalHeight / 2;
        }
        const svgParts = [];
        const minConnectionDistance = Math.max(this.options.padding, 20);
        let currentY = this.options.padding;
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const availableWidth = maxWidth - (2 * minConnectionDistance);
            const childX = minConnectionDistance + (availableWidth - result.width) / 2;
            const translatedSvg = `<g transform="translate(${childX}, ${currentY})">${result.svgContent}</g>`;
            svgParts.push(translatedSvg);
            const elementBaseline = currentY + result.baseline;
            const isMiddleElement = results.length % 2 === 1 && i === Math.floor(results.length / 2);
            const leftConnectionX = childX;
            const rightConnectionX = childX + result.width;
            if (isMiddleElement || Math.abs(elementBaseline - externalBaseline) <= 2) {
                svgParts.push(this.createPath([
                    { x: 0, y: externalBaseline },
                    { x: leftConnectionX, y: externalBaseline },
                ]));
                svgParts.push(this.createPath([
                    { x: rightConnectionX, y: externalBaseline },
                    { x: maxWidth, y: externalBaseline },
                ]));
            }
            else {
                svgParts.push(this.createPath([
                    { x: 0, y: externalBaseline },
                    { x: minConnectionDistance / 2, y: externalBaseline },
                    { x: minConnectionDistance / 2, y: elementBaseline },
                    { x: leftConnectionX, y: elementBaseline },
                ]));
                svgParts.push(this.createPath([
                    { x: rightConnectionX, y: elementBaseline },
                    { x: maxWidth - (minConnectionDistance / 2), y: elementBaseline },
                    { x: maxWidth - (minConnectionDistance / 2), y: externalBaseline },
                    { x: maxWidth, y: externalBaseline },
                ]));
            }
            currentY += result.height + this.options.padding;
        }
        return {
            width: maxWidth,
            height: totalHeight,
            baseline: externalBaseline,
            svgContent: this.wrapWithDebug(svgParts.join(''), maxWidth, totalHeight, externalBaseline),
            connectorLeft: { x: 0, y: externalBaseline },
            connectorRight: { x: maxWidth, y: externalBaseline },
        };
    }
    layoutBypassContent(expression) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return {
                width: 0,
                height: 0,
                baseline: 0,
                svgContent: '',
                connectorLeft: { x: 0, y: 0 },
                connectorRight: { x: 0, y: 0 },
            };
        }
        const element = elements[0];
        let childResult;
        switch (element.type) {
            case 'terminal':
                childResult = this.layoutTerminalContent(element);
                break;
            case 'nonterminal':
                childResult = this.layoutNonterminalContent(element);
                break;
            case 'inline':
                childResult = this.layoutInlineContent(element);
                break;
            case 'stack':
                childResult = this.layoutStackContent(element);
                break;
            case 'bypass':
                childResult = this.layoutBypassContent(element);
                break;
            case 'loop':
                childResult = this.layoutLoopContent(element);
                break;
            case 'group':
                childResult = this.layoutGroupContent(element);
                break;
            default:
                throw new Error(`Unknown expression type: ${element.type}`);
        }
        const totalWidth = childResult.width + this.options.padding * 2;
        const bypassOffset = this.options.padding;
        const spaceAbove = childResult.baseline;
        const spaceBelow = childResult.height - childResult.baseline;
        const bypassBelow = spaceBelow >= spaceAbove;
        const childX = this.options.padding;
        const childY = this.options.padding;
        const externalBaseline = childY + childResult.baseline;
        let bypassY;
        let totalHeight;
        if (bypassBelow) {
            bypassY = childY + childResult.height + bypassOffset;
            totalHeight = bypassY + this.options.padding;
        }
        else {
            bypassY = childY - bypassOffset;
            totalHeight = childY + childResult.height + this.options.padding;
        }
        const svgParts = [];
        svgParts.push(`<g transform="translate(${childX}, ${childY})">${childResult.svgContent}</g>`);
        const bypassPath = [
            { x: 0, y: externalBaseline },
            { x: this.options.padding / 2, y: externalBaseline },
            { x: this.options.padding / 2, y: bypassY },
            { x: totalWidth - this.options.padding / 2, y: bypassY },
            { x: totalWidth - this.options.padding / 2, y: externalBaseline },
            { x: totalWidth, y: externalBaseline },
        ];
        svgParts.push(this.createPath(bypassPath));
        const mainPath = [
            { x: 0, y: externalBaseline },
            { x: this.options.padding, y: externalBaseline },
        ];
        svgParts.push(this.createPath(mainPath));
        const exitPath = [
            { x: this.options.padding + childResult.width, y: externalBaseline },
            { x: totalWidth, y: externalBaseline },
        ];
        svgParts.push(this.createPath(exitPath));
        return {
            width: totalWidth,
            height: totalHeight,
            baseline: externalBaseline,
            svgContent: this.wrapWithDebug(svgParts.join(''), totalWidth, totalHeight, externalBaseline),
            connectorLeft: { x: 0, y: externalBaseline },
            connectorRight: { x: totalWidth, y: externalBaseline },
        };
    }
    layoutLoopContent(expression) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return {
                width: 0,
                height: 0,
                baseline: 0,
                svgContent: '',
                connectorLeft: { x: 0, y: 0 },
                connectorRight: { x: 0, y: 0 },
            };
        }
        const element = elements[0];
        let childResult;
        switch (element.type) {
            case 'terminal':
                childResult = this.layoutTerminalContent(element);
                break;
            case 'nonterminal':
                childResult = this.layoutNonterminalContent(element);
                break;
            case 'inline':
                childResult = this.layoutInlineContent(element);
                break;
            case 'stack':
                childResult = this.layoutStackContent(element);
                break;
            case 'bypass':
                childResult = this.layoutBypassContent(element);
                break;
            case 'loop':
                childResult = this.layoutLoopContent(element);
                break;
            case 'group':
                childResult = this.layoutGroupContent(element);
                break;
            default:
                throw new Error(`Unknown expression type: ${element.type}`);
        }
        const totalWidth = childResult.width + this.options.padding * 2;
        const childX = this.options.padding;
        const childY = this.options.padding;
        const externalBaseline = childY + childResult.baseline;
        const loopOffset = this.options.padding;
        const loopY = childY - loopOffset;
        const minY = Math.min(loopY, childY);
        const maxY = Math.max(childY + childResult.height, childY + childResult.height);
        const totalHeight = maxY - minY + this.options.padding;
        const svgParts = [];
        svgParts.push(`<g transform="translate(${childX}, ${childY})">${childResult.svgContent}</g>`);
        const mainPath = [
            { x: 0, y: externalBaseline },
            { x: this.options.padding, y: externalBaseline },
        ];
        svgParts.push(this.createPath(mainPath));
        const exitPath = [
            { x: this.options.padding + childResult.width, y: externalBaseline },
            { x: totalWidth, y: externalBaseline },
        ];
        svgParts.push(this.createPath(exitPath));
        const loopConnectionX = Math.max(this.options.padding * 0.8, 8);
        const loopPath = [
            { x: this.options.padding + childResult.width, y: externalBaseline },
            { x: totalWidth - this.options.padding / 2, y: externalBaseline },
            { x: totalWidth - this.options.padding / 2, y: loopY },
            { x: this.options.padding / 2, y: loopY },
            { x: this.options.padding / 2, y: externalBaseline },
            { x: loopConnectionX, y: externalBaseline },
        ];
        svgParts.push(this.createPath(loopPath));
        return {
            width: totalWidth,
            height: totalHeight,
            baseline: externalBaseline,
            svgContent: this.wrapWithDebug(svgParts.join(''), totalWidth, totalHeight, externalBaseline),
            connectorLeft: { x: 0, y: externalBaseline },
            connectorRight: { x: totalWidth, y: externalBaseline },
        };
    }
    layoutGroupContent(expression) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return {
                width: 0,
                height: 0,
                baseline: 0,
                svgContent: '',
                connectorLeft: { x: 0, y: 0 },
                connectorRight: { x: 0, y: 0 },
            };
        }
        const element = elements[0];
        switch (element.type) {
            case 'terminal':
                return this.layoutTerminalContent(element);
            case 'nonterminal':
                return this.layoutNonterminalContent(element);
            case 'inline':
                return this.layoutInlineContent(element);
            case 'stack':
                return this.layoutStackContent(element);
            case 'bypass':
                return this.layoutBypassContent(element);
            case 'loop':
                return this.layoutLoopContent(element);
            case 'group':
                return this.layoutGroupContent(element);
            default:
                throw new Error(`Unknown expression type: ${element.type}`);
        }
    }
    layoutOption(expression, x, y) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return this.createEmptyLayout(x, y);
        }
        const innerResult = this.layoutExpression(elements[0], x + this.options.padding, y + this.options.padding);
        const totalWidth = innerResult.width + this.options.padding * 2;
        const spaceAbove = innerResult.baseline - y - this.options.padding;
        const spaceBelow = y + this.options.padding + innerResult.height - innerResult.baseline;
        const bypassBelow = spaceBelow >= spaceAbove;
        const bypassOffset = this.options.padding;
        const totalHeight = innerResult.height + this.options.padding * 2 + bypassOffset;
        const externalBaseline = innerResult.baseline;
        const bypassY = bypassBelow ?
            innerResult.baseline + bypassOffset :
            innerResult.baseline - bypassOffset;
        const svgElements = [innerResult.svgContent];
        const bypassPath = [
            { x, y: externalBaseline },
            { x: x + this.options.padding / 2, y: externalBaseline },
            { x: x + this.options.padding / 2, y: bypassY },
            { x: x + totalWidth - this.options.padding / 2, y: bypassY },
            { x: x + totalWidth - this.options.padding / 2, y: externalBaseline },
            { x: x + totalWidth, y: externalBaseline },
        ];
        svgElements.push(this.createPath(bypassPath));
        const mainPath = [
            { x, y: externalBaseline },
            { x: x + this.options.padding, y: externalBaseline },
        ];
        svgElements.push(this.createPath(mainPath));
        const exitPath = [
            { x: x + this.options.padding + innerResult.width, y: externalBaseline },
            { x: x + totalWidth, y: externalBaseline },
        ];
        svgElements.push(this.createPath(exitPath));
        return {
            width: totalWidth,
            height: totalHeight,
            baseline: externalBaseline,
            svgContent: svgElements.join(''),
            connectorLeft: { x, y: externalBaseline },
            connectorRight: { x: x + totalWidth, y: externalBaseline },
        };
    }
    layoutRepetition(expression, x, y) {
        const elements = expression.elements || [];
        if (elements.length === 0) {
            return this.createEmptyLayout(x, y);
        }
        const innerResult = this.layoutExpression(elements[0], x + this.options.padding, y + this.options.padding);
        const totalWidth = innerResult.width + this.options.padding * 2;
        const totalHeight = innerResult.height + this.options.padding * 3;
        const externalBaseline = y + totalHeight / 2;
        const internalBaseline = innerResult.baseline;
        const svgElements = [innerResult.svgContent];
        const mainPath = [
            { x, y: externalBaseline },
            { x: x + this.options.padding, y: internalBaseline },
        ];
        svgElements.push(this.createPath(mainPath));
        const exitPath = [
            { x: x + this.options.padding + innerResult.width, y: internalBaseline },
            { x: x + totalWidth, y: externalBaseline },
        ];
        svgElements.push(this.createPath(exitPath));
        const loopY = y;
        const loopPath = [
            { x: x + this.options.padding + innerResult.width, y: internalBaseline },
            { x: x + totalWidth - this.options.padding / 2, y: internalBaseline },
            { x: x + totalWidth - this.options.padding / 2, y: loopY },
            { x: x + this.options.padding / 2, y: loopY },
            { x: x + this.options.padding / 2, y: internalBaseline },
            { x: x + this.options.padding, y: internalBaseline },
        ];
        svgElements.push(this.createPath(loopPath));
        return {
            width: totalWidth,
            height: totalHeight,
            baseline: externalBaseline,
            svgContent: svgElements.join(''),
            connectorLeft: { x, y: externalBaseline },
            connectorRight: { x: x + totalWidth, y: externalBaseline },
        };
    }
    createEmptyLayout(x, y) {
        const width = 20;
        const height = 20;
        const baseline = y + height / 2;
        return {
            width,
            height,
            baseline,
            svgContent: '',
            connectorLeft: { x, y: baseline },
            connectorRight: { x: x + width, y: baseline },
        };
    }
    createRoundedRect(x, y, width, height, style) {
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
            rx="${this.options.cornerRadius}" ry="${this.options.cornerRadius}"
            fill="${style.fill}" stroke="${style.stroke}" stroke-width="${this.options.strokeWidth}"/>`;
    }
    createText(x, y, text, attributes = {}) {
        const attrs = Object.entries(attributes)
            .map(([key, value]) => {
            const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${attrName}="${value}"`;
        })
            .join(' ');
        const attrsStr = attrs ? ` ${attrs}` : '';
        return `<text x="${x}" y="${y}" font-family="${this.options.fontFamily}" 
            font-size="${this.options.fontSize}"${attrsStr}>${this.escapeXml(text)}</text>`;
    }
    createPath(points) {
        if (points.length < 2)
            return '';
        let pathData = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const current = points[i];
            if (i === points.length - 1) {
                pathData += ` L ${current.x} ${current.y}`;
            }
            else {
                const next = points[i + 1];
                const cornerRadius = this.options.cornerRadius;
                if (prev.x === current.x) {
                    const yDirection = current.y > prev.y ? 1 : -1;
                    const endY = current.y - (cornerRadius * yDirection);
                    pathData += ` L ${current.x} ${endY}`;
                    if (next.x !== current.x) {
                        const xDirection = next.x > current.x ? 1 : -1;
                        const endX = current.x + (cornerRadius * xDirection);
                        pathData += ` Q ${current.x} ${current.y} ${endX} ${current.y}`;
                    }
                }
                else {
                    const xDirection = current.x > prev.x ? 1 : -1;
                    const endX = current.x - (cornerRadius * xDirection);
                    pathData += ` L ${endX} ${current.y}`;
                    if (next.y !== current.y) {
                        const yDirection = next.y > current.y ? 1 : -1;
                        const endY = current.y + (cornerRadius * yDirection);
                        pathData += ` Q ${current.x} ${current.y} ${current.x} ${endY}`;
                    }
                }
            }
        }
        return `<path d="${pathData}" fill="none" stroke="#333" stroke-width="${this.options.strokeWidth}"/>`;
    }
    measureText(text) {
        return text.length * this.options.fontSize * 0.6;
    }
    createArrow(x, y, direction) {
        const size = 6;
        const strokeWidth = 2;
        if (direction === 'left') {
            return `<path d="M ${x + size} ${y - size} L ${x} ${y} L ${x + size} ${y + size}" 
              fill="none" stroke="#333" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        else {
            return `<path d="M ${x - size} ${y - size} L ${x} ${y} L ${x - size} ${y + size}" 
              fill="none" stroke="#333" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
    }
    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    createDebugVisualization(width, height, baseline, x = 0, y = 0) {
        if (!this.options.debug) {
            return '';
        }
        const debugElements = [];
        debugElements.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" style="stroke: hotpink; stroke-width: 0.5px; stroke-dasharray: 2,1;"/>`);
        debugElements.push(`<line x1="${x}" y1="${y + baseline}" x2="${x + width}" y2="${y + baseline}" style="stroke: hotpink; stroke-width: 0.5px; stroke-dasharray: 1,1;"/>`);
        return debugElements.join('');
    }
    wrapWithDebug(content, width, height, baseline, x = 0, y = 0) {
        if (!this.options.debug) {
            return content;
        }
        return content + this.createDebugVisualization(width, height, baseline, x, y);
    }
}
exports.SVGLayoutEngine = SVGLayoutEngine;
//# sourceMappingURL=svg-layout-engine.js.map