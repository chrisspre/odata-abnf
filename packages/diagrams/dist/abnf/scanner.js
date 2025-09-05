"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const token_js_1 = require("./token.js");
const token_kind_js_1 = require("./token-kind.js");
class Scanner {
    static scan(input) {
        const tokens = [];
        let line = 1;
        let col = 1;
        let pos = 0;
        this.TOKEN_REGEX.lastIndex = 0;
        let match = this.TOKEN_REGEX.exec(input);
        while (match) {
            let matchedGroup = null;
            let matchedValue = null;
            for (const [groupName, groupValue] of Object.entries(match.groups || {})) {
                if (groupValue !== undefined) {
                    matchedGroup = groupName;
                    matchedValue = groupValue;
                    break;
                }
            }
            if (matchedGroup && matchedValue !== null) {
                const tokenKind = this.getTokenKind(matchedGroup);
                tokens.push(new token_js_1.Token(tokenKind, matchedValue, line, col));
                for (let i = 0; i < matchedValue.length; i++) {
                    if (matchedValue[i] === '\n') {
                        line++;
                        col = 1;
                    }
                    else if (matchedValue[i] !== '\r') {
                        col++;
                    }
                }
                pos += matchedValue.length;
            }
            match = this.TOKEN_REGEX.exec(input);
        }
        tokens.push(new token_js_1.Token(token_kind_js_1.TokenKind.EndOfInput, '', line, col));
        return tokens;
    }
    static getTokenKind(groupName) {
        switch (groupName) {
            case 'Whitespace': return token_kind_js_1.TokenKind.Whitespace;
            case 'Comment': return token_kind_js_1.TokenKind.Comment;
            case 'CRLF': return token_kind_js_1.TokenKind.CRLF;
            case 'RuleName': return token_kind_js_1.TokenKind.RuleName;
            case 'Repeat': return token_kind_js_1.TokenKind.Repeat;
            case 'Integer': return token_kind_js_1.TokenKind.Integer;
            case 'CharVal': return token_kind_js_1.TokenKind.CharVal;
            case 'CaseSensitiveCharVal': return token_kind_js_1.TokenKind.CaseSensitiveCharVal;
            case 'CaseInsensitiveStringVal': return token_kind_js_1.TokenKind.CaseInsensitiveStringVal;
            case 'CaseSensitiveStringVal': return token_kind_js_1.TokenKind.CaseSensitiveStringVal;
            case 'ProseVal': return token_kind_js_1.TokenKind.ProseVal;
            case 'ValueRange': return token_kind_js_1.TokenKind.ValueRange;
            case 'NumVal': return token_kind_js_1.TokenKind.NumVal;
            case 'Equal': return token_kind_js_1.TokenKind.Equal;
            case 'Slash': return token_kind_js_1.TokenKind.Slash;
            case 'Star': return token_kind_js_1.TokenKind.Star;
            case 'OpenParen': return token_kind_js_1.TokenKind.OpenParen;
            case 'CloseParen': return token_kind_js_1.TokenKind.CloseParen;
            case 'OpenBracket': return token_kind_js_1.TokenKind.OpenBracket;
            case 'CloseBracket': return token_kind_js_1.TokenKind.CloseBracket;
            case 'OpenAngle': return token_kind_js_1.TokenKind.OpenAngle;
            case 'CloseAngle': return token_kind_js_1.TokenKind.CloseAngle;
            case 'Percent': return token_kind_js_1.TokenKind.Percent;
            case 'OtherSymbol': return token_kind_js_1.TokenKind.OtherSymbol;
            default: return token_kind_js_1.TokenKind.OtherSymbol;
        }
    }
}
exports.Scanner = Scanner;
Scanner.TOKEN_REGEX = new RegExp([
    '(?<Whitespace>[ \\t]+)',
    '(?<Comment>;[^\\r\\n]*)',
    '(?<CRLF>\\r\\n|\\n|\\r)',
    '(?<RuleName>[A-Za-z][A-Za-z0-9-]*)',
    '(?<Repeat>([0-9]+)?\\*[0-9]*)',
    '(?<Integer>[0-9]+)(?!\\*)',
    '(?<CaseInsensitiveStringVal>%[iI]"[^"]*")',
    '(?<CaseSensitiveStringVal>%[sS]"[^"]*")',
    '(?<CharVal>"[^"]*")',
    '(?<CaseSensitiveCharVal>\'[^\']*\')',
    '(?<ProseVal><[^>]*>)',
    '(?<ValueRange>%[bBdDxX][0-9A-Fa-f]+-[0-9A-Fa-f]+)',
    '(?<NumVal>%[bBdDxX][0-9A-Fa-f]+(?:\\.[0-9A-Fa-f]+)*)',
    '(?<Equal>=)',
    '(?<Slash>/)',
    '(?<Star>\\*)',
    '(?<OpenParen>\\()',
    '(?<CloseParen>\\))',
    '(?<OpenBracket>\\[)',
    '(?<CloseBracket>\\])',
    '(?<OpenAngle><)',
    '(?<CloseAngle>>)',
    '(?<Percent>%)(?![bBdDxXiIsS])',
    '(?<OtherSymbol>[-])'
].join('|'), 'gm');
//# sourceMappingURL=scanner.js.map