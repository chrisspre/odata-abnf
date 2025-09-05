import { Token } from './token.js';
import { AstNode } from './ast-node.js';
export declare class Parser {
    private readonly tokens;
    private readonly fileName?;
    constructor(tokens: Token[], fileName?: string);
    private match;
    private expect;
    private skipTrivia;
    parseRuleList(): AstNode.RuleList;
    private parseRule;
    private parseAlternation;
    private parseConcatenation;
    private parseRepetition;
    private parseElement;
    private parseGroup;
    private parseOption;
    private isElementStart;
}
//# sourceMappingURL=parser.d.ts.map