"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RailroadGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const grammar_parser_1 = require("./grammar-parser");
const html_generator_1 = require("./html-generator");
class RailroadGenerator {
    constructor(options = {}) {
        this.options = {
            outputFormat: 'html',
            theme: 'default',
            ...options,
        };
        this.htmlGenerator = new html_generator_1.HTMLGenerator(this.options);
    }
    generate(rules, outputStream, filename) {
        console.log(`Generating railroad diagrams for ${rules.length} rules`);
        const html = this.htmlGenerator.generateHTML(rules, filename);
        outputStream.write(html);
        if (outputStream !== process.stdout) {
            outputStream.end();
        }
        console.log('Railroad diagram generation completed');
    }
    generateFromContent(grammarText, outputStream, filename) {
        console.log('Parsing grammar content');
        const parser = new grammar_parser_1.GrammarParser(grammarText);
        const rules = parser.parseGrammar();
        console.log(`Parsed ${rules.length} grammar rules`);
        this.generate(rules, outputStream, filename);
    }
    generateFromFile(inputPath, outputStream) {
        console.log(`Reading grammar from file: ${inputPath}`);
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Grammar file not found: ${inputPath}`);
        }
        const grammarText = fs.readFileSync(inputPath, 'utf-8');
        const filename = path.basename(inputPath);
        this.generateFromContent(grammarText, outputStream, filename);
    }
    generateToString(grammarText, filename) {
        const parser = new grammar_parser_1.GrammarParser(grammarText);
        const rules = parser.parseGrammar();
        return this.htmlGenerator.generateHTML(rules, filename);
    }
    generateToFile(inputPath, outputPath) {
        if (!outputPath) {
            const inputDir = path.dirname(inputPath);
            const inputName = path.basename(inputPath, path.extname(inputPath));
            outputPath = path.join(inputDir, `${inputName}.html`);
        }
        console.log(`Generating ${inputPath} -> ${outputPath}`);
        const outputStream = fs.createWriteStream(outputPath);
        this.generateFromFile(inputPath, outputStream);
        console.log(`Railroad diagram saved to: ${outputPath}`);
    }
    generateFromContentToFile(grammarText, outputPath, filename) {
        console.log(`Generating grammar content -> ${outputPath}`);
        const outputStream = fs.createWriteStream(outputPath);
        this.generateFromContent(grammarText, outputStream, filename);
        console.log(`Railroad diagram saved to: ${outputPath}`);
    }
    setOptions(options) {
        this.options = { ...this.options, ...options };
        this.htmlGenerator = new html_generator_1.HTMLGenerator(this.options);
    }
}
exports.RailroadGenerator = RailroadGenerator;
//# sourceMappingURL=railroad-generator.js.map