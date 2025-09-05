"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const token_kind_js_1 = require("./token-kind.js");
const token_stream_js_1 = require("./token-stream.js");
const ast_node_js_1 = require("./ast-node.js");
class Parser {
    constructor(tokens, fileName) {
        this.tokens = new token_stream_js_1.TokenStream(tokens);
        this.fileName = fileName;
    }
    match(kind) {
        return this.tokens.match(kind);
    }
    expect(kind) {
        return this.tokens.expect(kind, this.fileName);
    }
    skipTrivia() {
        this.tokens.skipTrivia();
    }
    parseRuleList() {
        const rules = [];
        while (this.match(token_kind_js_1.TokenKind.Whitespace) || this.match(token_kind_js_1.TokenKind.Comment) || this.match(token_kind_js_1.TokenKind.CRLF)) {
            this.tokens.moveNext();
        }
        while (!this.match(token_kind_js_1.TokenKind.EndOfInput)) {
            if (this.tokens.isAtRuleStart()) {
                rules.push(this.parseRule());
            }
            else {
                if (this.match(token_kind_js_1.TokenKind.Whitespace) || this.match(token_kind_js_1.TokenKind.Comment) || this.match(token_kind_js_1.TokenKind.CRLF)) {
                    this.tokens.moveNext();
                }
                else {
                    const current = this.tokens.current;
                    throw new token_stream_js_1.SyntaxException(`Expected rule name but found ${current.kind}`, this.fileName, current.line, current.column);
                }
            }
        }
        return ast_node_js_1.AstNode.RuleList(rules);
    }
    parseRule() {
        const name = this.expect(token_kind_js_1.TokenKind.RuleName).value;
        this.skipTrivia();
        this.expect(token_kind_js_1.TokenKind.Equal);
        this.skipTrivia();
        const expr = this.parseAlternation();
        this.skipTrivia();
        this.tokens.skipContinuationLines();
        if (this.match(token_kind_js_1.TokenKind.CRLF) && this.tokens.isAtRuleBoundary()) {
            this.tokens.moveNext();
        }
        else if (!this.match(token_kind_js_1.TokenKind.EndOfInput)) {
            const current = this.tokens.current;
            throw new token_stream_js_1.SyntaxException('Expected end of rule (CRLF)', this.fileName, current.line, current.column);
        }
        return ast_node_js_1.AstNode.Rule(name, expr);
    }
    parseAlternation() {
        const options = [this.parseConcatenation()];
        while (true) {
            this.skipTrivia();
            this.tokens.skipContinuationLines();
            if (this.tokens.isAtRuleBoundary() || this.match(token_kind_js_1.TokenKind.EndOfInput)) {
                break;
            }
            if (this.match(token_kind_js_1.TokenKind.Slash)) {
                this.tokens.moveNext();
                this.skipTrivia();
                this.tokens.skipContinuationLines();
                options.push(this.parseConcatenation());
            }
            else {
                break;
            }
        }
        return options.length === 1 ? options[0] : ast_node_js_1.AstNode.Alternation(options);
    }
    parseConcatenation() {
        const elements = [this.parseRepetition()];
        while (true) {
            this.skipTrivia();
            this.tokens.skipContinuationLines();
            if (this.tokens.isAtRuleBoundary() || this.match(token_kind_js_1.TokenKind.EndOfInput)) {
                break;
            }
            if (this.isElementStart()) {
                elements.push(this.parseRepetition());
            }
            else {
                break;
            }
        }
        return elements.length === 1 ? elements[0] : ast_node_js_1.AstNode.Concatenation(elements);
    }
    parseRepetition() {
        let min;
        let max;
        if (this.match(token_kind_js_1.TokenKind.Repeat)) {
            const repeatToken = this.expect(token_kind_js_1.TokenKind.Repeat).value;
            const parts = repeatToken.split('*');
            min = parts[0] === '' ? undefined : parseInt(parts[0], 10);
            max = parts.length > 1 && parts[1] !== '' ? parseInt(parts[1], 10) : undefined;
        }
        const element = this.parseElement();
        if (min !== undefined || max !== undefined) {
            return ast_node_js_1.AstNode.Repetition(min, max, element);
        }
        else {
            return element;
        }
    }
    parseElement() {
        if (this.match(token_kind_js_1.TokenKind.RuleName)) {
            const name = this.expect(token_kind_js_1.TokenKind.RuleName).value;
            return ast_node_js_1.AstNode.RuleRef(name);
        }
        if (this.match(token_kind_js_1.TokenKind.OpenParen)) {
            return this.parseGroup();
        }
        if (this.match(token_kind_js_1.TokenKind.OpenBracket)) {
            return this.parseOption();
        }
        if (this.match(token_kind_js_1.TokenKind.CharVal)) {
            const value = this.expect(token_kind_js_1.TokenKind.CharVal).value;
            return ast_node_js_1.AstNode.Literal(value, false);
        }
        if (this.match(token_kind_js_1.TokenKind.CaseSensitiveCharVal)) {
            const value = this.expect(token_kind_js_1.TokenKind.CaseSensitiveCharVal).value;
            return ast_node_js_1.AstNode.Literal(value, true);
        }
        if (this.match(token_kind_js_1.TokenKind.NumVal)) {
            const value = this.expect(token_kind_js_1.TokenKind.NumVal).value;
            return ast_node_js_1.AstNode.NumberVal(value);
        }
        if (this.match(token_kind_js_1.TokenKind.ValueRange)) {
            const value = this.expect(token_kind_js_1.TokenKind.ValueRange).value;
            return ast_node_js_1.AstNode.NumberVal(value);
        }
        if (this.match(token_kind_js_1.TokenKind.ProseVal)) {
            const value = this.expect(token_kind_js_1.TokenKind.ProseVal).value;
            return ast_node_js_1.AstNode.ProseVal(value);
        }
        if (this.match(token_kind_js_1.TokenKind.Integer)) {
            const value = this.expect(token_kind_js_1.TokenKind.Integer).value;
            return ast_node_js_1.AstNode.NumberVal(value);
        }
        throw new token_stream_js_1.SyntaxException(`Expected element but found ${this.tokens.current.kind}`, this.fileName, this.tokens.current.line, this.tokens.current.column);
    }
    parseGroup() {
        this.expect(token_kind_js_1.TokenKind.OpenParen);
        this.skipTrivia();
        const inner = this.parseAlternation();
        this.skipTrivia();
        this.expect(token_kind_js_1.TokenKind.CloseParen);
        return ast_node_js_1.AstNode.Group(inner);
    }
    parseOption() {
        this.expect(token_kind_js_1.TokenKind.OpenBracket);
        this.skipTrivia();
        const inner = this.parseAlternation();
        this.skipTrivia();
        this.expect(token_kind_js_1.TokenKind.CloseBracket);
        return ast_node_js_1.AstNode.Option(inner);
    }
    isElementStart() {
        return this.match(token_kind_js_1.TokenKind.RuleName) ||
            this.match(token_kind_js_1.TokenKind.OpenParen) ||
            this.match(token_kind_js_1.TokenKind.OpenBracket) ||
            this.match(token_kind_js_1.TokenKind.CharVal) ||
            this.match(token_kind_js_1.TokenKind.CaseSensitiveCharVal) ||
            this.match(token_kind_js_1.TokenKind.NumVal) ||
            this.match(token_kind_js_1.TokenKind.ValueRange) ||
            this.match(token_kind_js_1.TokenKind.ProseVal) ||
            this.match(token_kind_js_1.TokenKind.Integer) ||
            this.match(token_kind_js_1.TokenKind.Repeat);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map