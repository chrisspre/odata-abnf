import { Expression, LayoutResult, DiagramOptions } from '../types';
export declare class SVGLayoutEngine {
    private options;
    constructor(options?: Partial<DiagramOptions>);
    layout(expression: Expression): LayoutResult;
    layoutRuleRightHandSide(expression: Expression): LayoutResult;
    getStrokeWidth(): number;
    private layoutExpression;
    private layoutTerminalContent;
    private layoutNonterminalContent;
    private layoutInlineContent;
    private layoutStackContent;
    private layoutBypassContent;
    private layoutLoopContent;
    private layoutGroupContent;
    private layoutOption;
    private layoutRepetition;
    private createEmptyLayout;
    private createRoundedRect;
    private createText;
    private createPath;
    private measureText;
    private createArrow;
    private escapeXml;
    private createDebugVisualization;
    private wrapWithDebug;
}
//# sourceMappingURL=svg-layout-engine.d.ts.map