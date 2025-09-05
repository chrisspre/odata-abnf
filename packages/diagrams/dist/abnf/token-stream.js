"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStream = exports.SyntaxException = void 0;
const token_js_1 = require("./token.js");
const token_kind_js_1 = require("./token-kind.js");
class SyntaxException extends Error {
    constructor(message, file, line, column) {
        const filePart = file || '<input>';
        const location = line !== undefined && column !== undefined ? ` at ${line}:${column}` : '';
        super(`${filePart}${location}: ${message}`);
        this.file = file;
        this.line = line;
        this.column = column;
        this.name = 'SyntaxException';
    }
}
exports.SyntaxException = SyntaxException;
class TokenStream {
    constructor(tokens) {
        this.position = 0;
        this.tokens = [...tokens];
    }
    get current() {
        return this.position < this.tokens.length ? this.tokens[this.position] : this.createEndOfInputToken();
    }
    get isAtEnd() {
        return this.position >= this.tokens.length;
    }
    get positionIndex() {
        return this.position;
    }
    moveNext() {
        if (this.position < this.tokens.length) {
            this.position++;
        }
    }
    peek(offset = 0) {
        const targetPos = this.position + offset;
        return targetPos < this.tokens.length ? this.tokens[targetPos] : this.createEndOfInputToken();
    }
    match(kind) {
        return this.current.kind === kind;
    }
    expect(kind, fileName) {
        if (this.current.kind !== kind) {
            throw new SyntaxException(`Expected ${kind} but found ${this.current.kind}`, fileName, this.current.line, this.current.column);
        }
        const token = this.current;
        this.moveNext();
        return token;
    }
    skipTrivia() {
        while (this.match(token_kind_js_1.TokenKind.Whitespace) || this.match(token_kind_js_1.TokenKind.Comment)) {
            this.moveNext();
        }
    }
    isAtRuleStart() {
        let pos = this.position;
        while (pos < this.tokens.length &&
            (this.tokens[pos].kind === token_kind_js_1.TokenKind.Whitespace || this.tokens[pos].kind === token_kind_js_1.TokenKind.Comment)) {
            pos++;
        }
        if (pos >= this.tokens.length || this.tokens[pos].kind !== token_kind_js_1.TokenKind.RuleName) {
            return false;
        }
        pos++;
        while (pos < this.tokens.length && this.tokens[pos].kind === token_kind_js_1.TokenKind.Whitespace) {
            pos++;
        }
        return pos < this.tokens.length && this.tokens[pos].kind === token_kind_js_1.TokenKind.Equal;
    }
    isAtRuleBoundary() {
        if (!this.match(token_kind_js_1.TokenKind.CRLF)) {
            return false;
        }
        let pos = this.position + 1;
        if (pos >= this.tokens.length) {
            return true;
        }
        while (pos < this.tokens.length &&
            (this.tokens[pos].kind === token_kind_js_1.TokenKind.Whitespace || this.tokens[pos].kind === token_kind_js_1.TokenKind.Comment)) {
            pos++;
        }
        if (pos >= this.tokens.length || this.tokens[pos].kind === token_kind_js_1.TokenKind.CRLF) {
            return true;
        }
        if (pos < this.tokens.length && this.tokens[pos].kind === token_kind_js_1.TokenKind.RuleName) {
            let nextPos = pos + 1;
            while (nextPos < this.tokens.length && this.tokens[nextPos].kind === token_kind_js_1.TokenKind.Whitespace) {
                nextPos++;
            }
            return nextPos < this.tokens.length && this.tokens[nextPos].kind === token_kind_js_1.TokenKind.Equal;
        }
        return false;
    }
    skipContinuationLines() {
        while (this.match(token_kind_js_1.TokenKind.CRLF) && !this.isAtRuleBoundary()) {
            this.moveNext();
            this.skipTrivia();
        }
    }
    createEndOfInputToken() {
        const lastToken = this.tokens.length > 0 ? this.tokens[this.tokens.length - 1] : null;
        return new token_js_1.Token(token_kind_js_1.TokenKind.EndOfInput, '', lastToken?.line ?? 0, lastToken?.column ?? 0);
    }
}
exports.TokenStream = TokenStream;
//# sourceMappingURL=token-stream.js.map