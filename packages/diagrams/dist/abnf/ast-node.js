"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstNode = void 0;
exports.AstNode = {
    RuleList: (rules) => ({
        kind: 'RuleList',
        rules
    }),
    Rule: (name, expression) => ({
        kind: 'Rule',
        name,
        expression
    }),
    Alternation: (options) => ({
        kind: 'Alternation',
        options
    }),
    Concatenation: (elements) => ({
        kind: 'Concatenation',
        elements
    }),
    Repetition: (min, max, element) => ({
        kind: 'Repetition',
        min,
        max,
        element
    }),
    Group: (inner) => ({
        kind: 'Group',
        inner
    }),
    Option: (inner) => ({
        kind: 'Option',
        inner
    }),
    RuleRef: (name) => ({
        kind: 'RuleRef',
        name
    }),
    Literal: (value, isCaseSensitive) => ({
        kind: 'Literal',
        value,
        isCaseSensitive
    }),
    NumberVal: (value) => ({
        kind: 'NumberVal',
        value
    }),
    ProseVal: (value) => ({
        kind: 'ProseVal',
        value
    })
};
//# sourceMappingURL=ast-node.js.map