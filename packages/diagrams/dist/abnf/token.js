"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const token_kind_js_1 = require("./token-kind.js");
class Token {
    constructor(kind, value, line, column) {
        this.kind = kind;
        this.value = value;
        this.line = line;
        this.column = column;
    }
    stringValue() {
        if (this.kind === token_kind_js_1.TokenKind.CharVal || this.kind === token_kind_js_1.TokenKind.CaseSensitiveCharVal) {
            if (this.value.length >= 2 && (this.value[0] === '"' || this.value[0] === "'")) {
                return this.value.substring(1, this.value.length - 1);
            }
            return this.value;
        }
        if (this.kind === token_kind_js_1.TokenKind.NumVal) {
            if (this.value.length < 3 || (this.value[0] !== '%' || this.value[1].toLowerCase() !== 'x')) {
                throw new Error(`Only %x... notation is supported: ${this.value}`);
            }
            const bytes = this.value.substring(2).split('.');
            const chars = new Array(bytes.length);
            for (let i = 0; i < bytes.length; i++) {
                if (bytes[i].length === 0) {
                    throw new Error(`Empty byte in percent notation: ${this.value}`);
                }
                const code = parseInt(bytes[i], 16);
                chars[i] = String.fromCharCode(code);
            }
            return chars.join('');
        }
        if (this.kind === token_kind_js_1.TokenKind.ValueRange) {
            return this.value;
        }
        throw new Error(`Token is not a CharVal, NumVal, or ValueRange: ${this.kind}`);
    }
    toString() {
        return `${this.kind} '${this.value}' @ ${this.line}:${this.column}`;
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map