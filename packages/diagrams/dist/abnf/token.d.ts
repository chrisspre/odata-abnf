import { TokenKind } from './token-kind.js';
export declare class Token {
    readonly kind: TokenKind;
    readonly value: string;
    readonly line: number;
    readonly column: number;
    constructor(kind: TokenKind, value: string, line: number, column: number);
    stringValue(): string;
    toString(): string;
}
//# sourceMappingURL=token.d.ts.map