import { AstNode } from './ast-node.js';
import { Expression } from '../types/grammar.js';
export declare class RailroadTransformer {
    static transformRuleList(ruleList: AstNode.RuleList): Array<{
        name: string;
        expression: Expression;
    }>;
    static transformExpression(expr: AstNode.Expression): Expression;
    private static transformAlternation;
    private static transformConcatenation;
    private static transformRepetition;
    private static transformGroup;
    private static transformOption;
    private static transformRuleRef;
    private static transformLiteral;
    private static transformNumberVal;
    private static transformProseVal;
    static createRailroadDocument(ruleList: AstNode.RuleList): string;
    private static expressionToString;
}
//# sourceMappingURL=railroad-transformer.d.ts.map