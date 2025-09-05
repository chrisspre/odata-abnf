import { Token } from './token.js';
import { TokenKind } from './token-kind.js';
export declare class SyntaxException extends Error {
    readonly file?: string | undefined;
    readonly line?: number | undefined;
    readonly column?: number | undefined;
    constructor(message: string, file?: string | undefined, line?: number | undefined, column?: number | undefined);
}
export declare class TokenStream {
    private readonly tokens;
    private position;
    constructor(tokens: Token[]);
    get current(): Token;
    get isAtEnd(): boolean;
    get positionIndex(): number;
    moveNext(): void;
    peek(offset?: number): Token;
    match(kind: TokenKind): boolean;
    expect(kind: TokenKind, fileName?: string): Token;
    skipTrivia(): void;
    isAtRuleStart(): boolean;
    isAtRuleBoundary(): boolean;
    skipContinuationLines(): void;
    private createEndOfInputToken;
}
//# sourceMappingURL=token-stream.d.ts.map