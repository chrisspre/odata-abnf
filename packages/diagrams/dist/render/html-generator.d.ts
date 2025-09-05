import { GrammarRule, DiagramOptions } from '../types';
export declare class HTMLGenerator {
    private layoutEngine;
    private options;
    constructor(options?: DiagramOptions);
    generateHTML(rules: GrammarRule[], filename?: string): string;
    private generateHeader;
    private generateStyles;
    private generateRuleHTML;
    private generateScript;
    private escapeHtml;
    private escapeId;
}
//# sourceMappingURL=html-generator.d.ts.map