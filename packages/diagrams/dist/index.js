#!/usr/bin/env node
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
const railroad_generator_1 = require("./render/railroad-generator");
Object.defineProperty(exports, "RailroadGenerator", { enumerable: true, get: function () { return railroad_generator_1.RailroadGenerator; } });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function main() {
    const minimist = require('minimist');
    const argv = minimist(process.argv.slice(2));
    const allowedOptions = new Set(['debug', 'no-debug', 'ast-tree', '_']);
    Object.keys(argv).forEach(opt => {
        if (!allowedOptions.has(opt)) {
            console.warn(`Warning: Unexpected command line option: --${opt}`);
        }
    });
    const inputFile = argv._[0];
    if (!inputFile) {
        console.error('Railroad.js - Railroad Diagram Generator');
        console.error('Usage: railroad-js <input-file> [--debug] [--no-debug] [--railroad]');
        console.error('');
        console.error('Options:');
        console.error('  --debug     Show debug information (bounding boxes and baselines)');
        console.error('  --no-debug  Explicitly disable debug mode');
        console.error('  --railroad  Also generate .railroad file');
        process.exit(1);
    }
    const debugMode = argv['debug'] && !argv['no-debug'];
    const options = {
        debug: debugMode
    };
    if (debugMode) {
        console.log('Debug mode enabled - showing bounding boxes and baselines');
    }
    else if (argv['no-debug']) {
        console.log('Debug mode explicitly disabled');
    }
    const printAstTree = argv['ast-tree'] === true;
    try {
        generateFromAbnf(inputFile, options, printAstTree);
    }
    catch (error) {
        console.error('Error generating railroad diagram:', error);
        process.exit(1);
    }
}
function generateFromAbnf(inputFile, options, printAstTree) {
    const abnfContent = fs.readFileSync(inputFile, 'utf-8');
    const { parseAbnf, RailroadTransformer } = require('./abnf/index.js');
    const ast = parseAbnf(abnfContent, inputFile);
    const railroadRules = RailroadTransformer.transformRuleList(ast);
    if (printAstTree) {
        printAsciiAstTree(ast);
        return;
    }
    const generator = new railroad_generator_1.RailroadGenerator(options);
    const htmlFile = inputFile.replace(/\.[^.]*$/, '.html');
    const outputStream = fs.createWriteStream(htmlFile);
    generator.generate(railroadRules, outputStream, path.basename(inputFile));
    console.log(`HTML file saved to: ${htmlFile}`);
}
function printAsciiAstTree(ast) {
    function printNode(node, indent = '', isLast = true) {
        const marker = isLast ? '└─' : '├─';
        let label = '';
        if (node.type) {
            label += node.type;
            if (node.name)
                label += ` (${node.name})`;
            if (node.value)
                label += `: "${node.value}"`;
        }
        else if (node.kind) {
            label += node.kind;
            if (node.name)
                label += ` (${node.name})`;
            if (node.value)
                label += `: "${node.value}"`;
        }
        console.log(indent + marker + label);
        if (node.elements && Array.isArray(node.elements)) {
            for (let i = 0; i < node.elements.length; i++) {
                printNode(node.elements[i], indent + (isLast ? '   ' : '│  '), i === node.elements.length - 1);
            }
        }
        if (node.expression) {
            printNode(node.expression, indent + (isLast ? '   ' : '│  '), true);
        }
        if (node.rules && Array.isArray(node.rules)) {
            for (let i = 0; i < node.rules.length; i++) {
                printNode(node.rules[i], indent + (isLast ? '   ' : '│  '), i === node.rules.length - 1);
            }
        }
    }
    if (ast.rules && Array.isArray(ast.rules)) {
        console.log('AST Tree:');
        for (let i = 0; i < ast.rules.length; i++) {
            printNode(ast.rules[i], '', i === ast.rules.length - 1);
        }
    }
    else {
        printNode(ast);
    }
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=index.js.map