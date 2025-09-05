export declare namespace AstNode {
    interface RuleList {
        readonly kind: 'RuleList';
        readonly rules: Rule[];
    }
    interface Rule {
        readonly kind: 'Rule';
        readonly name: string;
        readonly expression: Expression;
    }
    type Expression = Alternation | Concatenation | Repetition | Group | Option | RuleRef | Literal | NumberVal | ProseVal;
    interface Alternation {
        readonly kind: 'Alternation';
        readonly options: Expression[];
    }
    interface Concatenation {
        readonly kind: 'Concatenation';
        readonly elements: Expression[];
    }
    interface Repetition {
        readonly kind: 'Repetition';
        readonly min?: number;
        readonly max?: number;
        readonly element: Expression;
    }
    interface Group {
        readonly kind: 'Group';
        readonly inner: Expression;
    }
    interface Option {
        readonly kind: 'Option';
        readonly inner: Expression;
    }
    interface RuleRef {
        readonly kind: 'RuleRef';
        readonly name: string;
    }
    interface Literal {
        readonly kind: 'Literal';
        readonly value: string;
        readonly isCaseSensitive: boolean;
    }
    interface NumberVal {
        readonly kind: 'NumberVal';
        readonly value: string;
    }
    interface ProseVal {
        readonly kind: 'ProseVal';
        readonly value: string;
    }
}
export declare const AstNode: {
    RuleList: (rules: AstNode.Rule[]) => AstNode.RuleList;
    Rule: (name: string, expression: AstNode.Expression) => AstNode.Rule;
    Alternation: (options: AstNode.Expression[]) => AstNode.Alternation;
    Concatenation: (elements: AstNode.Expression[]) => AstNode.Concatenation;
    Repetition: (min: number | undefined, max: number | undefined, element: AstNode.Expression) => AstNode.Repetition;
    Group: (inner: AstNode.Expression) => AstNode.Group;
    Option: (inner: AstNode.Expression) => AstNode.Option;
    RuleRef: (name: string) => AstNode.RuleRef;
    Literal: (value: string, isCaseSensitive: boolean) => AstNode.Literal;
    NumberVal: (value: string) => AstNode.NumberVal;
    ProseVal: (value: string) => AstNode.ProseVal;
};
//# sourceMappingURL=ast-node.d.ts.map