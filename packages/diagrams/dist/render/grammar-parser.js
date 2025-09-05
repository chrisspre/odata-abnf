"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarParser = void 0;
class GrammarParser {
    constructor(input) {
        this.allRuleNames = new Set();
        this.input = input.trim();
        this.position = 0;
    }
    parseGrammar() {
        const rules = [];
        const lines = this.input.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('//')) {
                const equalIndex = trimmedLine.indexOf('=');
                if (equalIndex !== -1) {
                    const name = trimmedLine.substring(0, equalIndex).trim();
                    this.allRuleNames.add(name);
                }
            }
        }
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('//')) {
                const rule = this.parseRule(trimmedLine);
                if (rule) {
                    rules.push(rule);
                }
            }
        }
        return rules;
    }
    parseRule(line) {
        const equalIndex = line.indexOf('=');
        if (equalIndex === -1)
            return null;
        const name = line.substring(0, equalIndex).trim();
        const rhs = line.substring(equalIndex + 1).trim();
        const expression = this.parseExpression(rhs);
        return { name, expression };
    }
    parseExpression(input) {
        this.input = input;
        this.position = 0;
        return this.parseOperatorExpression();
    }
    parseOperatorExpression() {
        this.skipWhitespace();
        if (this.matchKeyword('inline')) {
            return this.parseOperator('inline');
        }
        else if (this.matchKeyword('stack')) {
            return this.parseOperator('stack');
        }
        else if (this.matchKeyword('bypass')) {
            return this.parseOperator('bypass');
        }
        else if (this.matchKeyword('loop')) {
            return this.parseOperator('loop');
        }
        else if (this.matchKeyword('group')) {
            return this.parseOperator('group');
        }
        else if (this.matchKeyword('lookahead')) {
            return this.parseOperator('lookahead');
        }
        else {
            return this.parseAtom();
        }
    }
    parseOperator(type) {
        this.skipWhitespace();
        this.expect('(');
        const elements = [];
        while (!this.isAtEnd() && this.peek() !== ')') {
            this.skipWhitespace();
            if (this.peek() === ')')
                break;
            elements.push(this.parseOperatorExpression());
            this.skipWhitespace();
            if (this.peek() === ',') {
                this.advance();
                this.skipWhitespace();
            }
        }
        this.expect(')');
        return { type, elements };
    }
    parseAtom() {
        this.skipWhitespace();
        if (this.peek() === '"') {
            return this.parseTerminal();
        }
        else if (this.peek() === '<') {
            return this.parseNonterminal();
        }
        else {
            return this.parseSimpleTerminal();
        }
    }
    parseTerminal() {
        this.expect('"');
        let value = '';
        while (!this.isAtEnd() && this.peek() !== '"') {
            if (this.peek() === '\\') {
                value += this.advance();
                if (!this.isAtEnd()) {
                    value += this.advance();
                }
            }
            else {
                value += this.advance();
            }
        }
        this.expect('"');
        return { type: 'terminal', value };
    }
    parseNonterminal() {
        this.expect('<');
        let value = '';
        while (!this.isAtEnd() && this.peek() !== '>') {
            value += this.advance();
        }
        this.expect('>');
        return { type: 'nonterminal', value };
    }
    parseSimpleTerminal() {
        let value = '';
        while (!this.isAtEnd() &&
            this.peek() !== ',' &&
            this.peek() !== ')' &&
            this.peek() !== '(' &&
            !this.isWhitespace(this.peek())) {
            value += this.advance();
        }
        if (this.allRuleNames.has(value)) {
            return { type: 'nonterminal', value };
        }
        return { type: 'terminal', value };
    }
    matchKeyword(keyword) {
        const saved = this.position;
        this.skipWhitespace();
        for (let i = 0; i < keyword.length; i++) {
            if (this.isAtEnd() || this.advance() !== keyword[i]) {
                this.position = saved;
                return false;
            }
        }
        if (!this.isAtEnd() && !this.isWhitespace(this.peek()) && this.peek() !== '(') {
            this.position = saved;
            return false;
        }
        return true;
    }
    skipWhitespace() {
        while (!this.isAtEnd() && this.isWhitespace(this.peek())) {
            this.advance();
        }
    }
    isWhitespace(char) {
        return /\s/.test(char);
    }
    peek() {
        return this.isAtEnd() ? '\0' : this.input[this.position];
    }
    advance() {
        return this.isAtEnd() ? '\0' : this.input[this.position++];
    }
    expect(expected) {
        if (this.peek() !== expected) {
            throw new Error(`Expected '${expected}' at position ${this.position}, got '${this.peek()}'`);
        }
        this.advance();
    }
    isAtEnd() {
        return this.position >= this.input.length;
    }
}
exports.GrammarParser = GrammarParser;
//# sourceMappingURL=grammar-parser.js.map