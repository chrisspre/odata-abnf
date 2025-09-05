"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RailroadTransformer = exports.Parser = exports.AstNode = exports.SyntaxException = exports.TokenStream = exports.Scanner = exports.Token = exports.TokenKind = void 0;
exports.parseAbnfToRailroad = parseAbnfToRailroad;
exports.parseAbnf = parseAbnf;
var token_kind_js_1 = require("./token-kind.js");
Object.defineProperty(exports, "TokenKind", { enumerable: true, get: function () { return token_kind_js_1.TokenKind; } });
var token_js_1 = require("./token.js");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return token_js_1.Token; } });
var scanner_js_1 = require("./scanner.js");
Object.defineProperty(exports, "Scanner", { enumerable: true, get: function () { return scanner_js_1.Scanner; } });
var token_stream_js_1 = require("./token-stream.js");
Object.defineProperty(exports, "TokenStream", { enumerable: true, get: function () { return token_stream_js_1.TokenStream; } });
Object.defineProperty(exports, "SyntaxException", { enumerable: true, get: function () { return token_stream_js_1.SyntaxException; } });
var ast_node_js_1 = require("./ast-node.js");
Object.defineProperty(exports, "AstNode", { enumerable: true, get: function () { return ast_node_js_1.AstNode; } });
var parser_js_1 = require("./parser.js");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return parser_js_1.Parser; } });
var railroad_transformer_js_1 = require("./railroad-transformer.js");
Object.defineProperty(exports, "RailroadTransformer", { enumerable: true, get: function () { return railroad_transformer_js_1.RailroadTransformer; } });
const scanner_js_2 = require("./scanner.js");
const parser_js_2 = require("./parser.js");
const railroad_transformer_js_2 = require("./railroad-transformer.js");
function parseAbnfToRailroad(abnfText, fileName) {
    const tokens = scanner_js_2.Scanner.scan(abnfText);
    const parser = new parser_js_2.Parser(tokens, fileName);
    const ruleList = parser.parseRuleList();
    return railroad_transformer_js_2.RailroadTransformer.createRailroadDocument(ruleList);
}
function parseAbnf(abnfText, fileName) {
    const tokens = scanner_js_2.Scanner.scan(abnfText);
    const parser = new parser_js_2.Parser(tokens, fileName);
    return parser.parseRuleList();
}
//# sourceMappingURL=index.js.map