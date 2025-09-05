import { Writable } from 'stream';
import { DiagramOptions, GrammarRule } from '../types';
export declare class RailroadGenerator {
    private options;
    private htmlGenerator;
    constructor(options?: Partial<DiagramOptions>);
    generate(rules: GrammarRule[], outputStream: Writable, filename?: string): void;
    generateFromContent(grammarText: string, outputStream: Writable, filename?: string): void;
    generateFromFile(inputPath: string, outputStream: Writable): void;
    generateToString(grammarText: string, filename?: string): string;
    generateToFile(inputPath: string, outputPath?: string): void;
    generateFromContentToFile(grammarText: string, outputPath: string, filename?: string): void;
    setOptions(options: Partial<DiagramOptions>): void;
}
//# sourceMappingURL=railroad-generator.d.ts.map