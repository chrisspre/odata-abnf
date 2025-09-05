import { GrammarRule } from '../types';
export declare class GrammarParser {
    private input;
    private position;
    private allRuleNames;
    constructor(input: string);
    parseGrammar(): GrammarRule[];
    private parseRule;
    private parseExpression;
    private parseOperatorExpression;
    private parseOperator;
    private parseAtom;
    private parseTerminal;
    private parseNonterminal;
    private parseSimpleTerminal;
    private matchKeyword;
    private skipWhitespace;
    private isWhitespace;
    private peek;
    private advance;
    private expect;
    private isAtEnd;
}
//# sourceMappingURL=grammar-parser.d.ts.map