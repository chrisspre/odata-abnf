export interface DiagramOptions {
    width?: number;
    height?: number;
    padding?: number;
    strokeWidth?: number;
    fontSize?: number;
    fontFamily?: string;
    cornerRadius?: number;
    minRailWidth?: number;
    outputFormat?: 'html' | 'svg' | 'png';
    theme?: 'default' | 'dark' | 'light';
    debug?: boolean;
    terminalStyle?: {
        fill?: string;
        stroke?: string;
        fontWeight?: string;
    };
    nonterminalStyle?: {
        fill?: string;
        stroke?: string;
        fontWeight?: string;
    };
}
//# sourceMappingURL=diagram-options.d.ts.map