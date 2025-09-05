export interface GrammarRule {
    name: string;
    expression: Expression;
}
export interface Expression {
    type: ExpressionType;
    elements?: Expression[];
    value?: string;
}
export type ExpressionType = 'inline' | 'stack' | 'bypass' | 'loop' | 'group' | 'lookahead' | 'terminal' | 'nonterminal';
//# sourceMappingURL=grammar.d.ts.map