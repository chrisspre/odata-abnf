"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RailroadTransformer = void 0;
class RailroadTransformer {
    static transformRuleList(ruleList) {
        return ruleList.rules.map(rule => ({
            name: rule.name,
            expression: this.transformExpression(rule.expression)
        }));
    }
    static transformExpression(expr) {
        switch (expr.kind) {
            case 'Alternation':
                return this.transformAlternation(expr);
            case 'Concatenation':
                return this.transformConcatenation(expr);
            case 'Repetition':
                return this.transformRepetition(expr);
            case 'Group':
                return this.transformGroup(expr);
            case 'Option':
                return this.transformOption(expr);
            case 'RuleRef':
                return this.transformRuleRef(expr);
            case 'Literal':
                return this.transformLiteral(expr);
            case 'NumberVal':
                return this.transformNumberVal(expr);
            case 'ProseVal':
                return this.transformProseVal(expr);
            default:
                throw new Error(`Unknown expression kind: ${expr.kind}`);
        }
    }
    static transformAlternation(expr) {
        if (expr.options.length === 1) {
            return this.transformExpression(expr.options[0]);
        }
        return {
            type: 'stack',
            elements: expr.options.map(option => this.transformExpression(option))
        };
    }
    static transformConcatenation(expr) {
        if (expr.elements.length === 1) {
            return this.transformExpression(expr.elements[0]);
        }
        return {
            type: 'inline',
            elements: expr.elements.map(element => this.transformExpression(element))
        };
    }
    static transformRepetition(expr) {
        const inner = this.transformExpression(expr.element);
        if (expr.min === 0 && expr.max === 1) {
            return {
                type: 'bypass',
                elements: [inner]
            };
        }
        if (expr.min === 0 && (expr.max === undefined || expr.max > 1)) {
            return {
                type: 'bypass',
                elements: [{
                        type: 'loop',
                        elements: [inner]
                    }]
            };
        }
        if (expr.min === 1 && (expr.max === undefined || expr.max > 1)) {
            return {
                type: 'loop',
                elements: [inner]
            };
        }
        if (expr.min !== undefined && expr.min > 1 && expr.max === expr.min) {
            const elements = Array(expr.min).fill(null).map(() => inner);
            return {
                type: 'inline',
                elements
            };
        }
        const minStr = expr.min !== undefined ? expr.min.toString() : '';
        const maxStr = expr.max !== undefined ? expr.max.toString() : '';
        const repetitionDesc = `${minStr}*${maxStr}`;
        return {
            type: 'group',
            elements: [{
                    type: 'inline',
                    elements: [
                        {
                            type: 'terminal',
                            value: `<${repetitionDesc} times>`
                        },
                        inner
                    ]
                }]
        };
    }
    static transformGroup(expr) {
        return {
            type: 'group',
            elements: [this.transformExpression(expr.inner)]
        };
    }
    static transformOption(expr) {
        return {
            type: 'bypass',
            elements: [this.transformExpression(expr.inner)]
        };
    }
    static transformRuleRef(expr) {
        return {
            type: 'nonterminal',
            value: expr.name
        };
    }
    static transformLiteral(expr) {
        let value = expr.value;
        if (value.length >= 2 && (value.startsWith('"') || value.startsWith("'"))) {
            value = value.slice(1, -1);
        }
        return {
            type: 'terminal',
            value: value
        };
    }
    static transformNumberVal(expr) {
        return {
            type: 'terminal',
            value: expr.value
        };
    }
    static transformProseVal(expr) {
        return {
            type: 'terminal',
            value: expr.value
        };
    }
    static createRailroadDocument(ruleList) {
        const rules = this.transformRuleList(ruleList);
        const ruleStrings = rules.map(rule => {
            const exprString = this.expressionToString(rule.expression);
            return `${rule.name} = ${exprString}`;
        });
        return ruleStrings.join('\n\n');
    }
    static expressionToString(expr) {
        switch (expr.type) {
            case 'terminal':
                return `"${expr.value}"`;
            case 'nonterminal':
                return `<${expr.value}>`;
            case 'inline':
                if (!expr.elements)
                    return '';
                const inlineElements = expr.elements.map(e => this.expressionToString(e));
                return `inline(${inlineElements.join(', ')})`;
            case 'stack':
                if (!expr.elements)
                    return '';
                const stackElements = expr.elements.map(e => this.expressionToString(e));
                return `stack(${stackElements.join(', ')})`;
            case 'bypass':
                if (!expr.elements || expr.elements.length === 0)
                    return '';
                return `bypass(${this.expressionToString(expr.elements[0])})`;
            case 'loop':
                if (!expr.elements || expr.elements.length === 0)
                    return '';
                return `loop(${this.expressionToString(expr.elements[0])})`;
            case 'group':
                if (!expr.elements || expr.elements.length === 0)
                    return '';
                return `group(${this.expressionToString(expr.elements[0])})`;
            default:
                return `<unknown: ${expr.type}>`;
        }
    }
}
exports.RailroadTransformer = RailroadTransformer;
//# sourceMappingURL=railroad-transformer.js.map