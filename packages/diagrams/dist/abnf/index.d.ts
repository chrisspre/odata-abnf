export { TokenKind } from './token-kind.js';
export { Token } from './token.js';
export { Scanner } from './scanner.js';
export { TokenStream, SyntaxException } from './token-stream.js';
export { AstNode } from './ast-node.js';
export { Parser } from './parser.js';
export { RailroadTransformer } from './railroad-transformer.js';
import { AstNode } from './ast-node.js';
export declare function parseAbnfToRailroad(abnfText: string, fileName?: string): string;
export declare function parseAbnf(abnfText: string, fileName?: string): AstNode.RuleList;
//# sourceMappingURL=index.d.ts.map