#!/usr/bin/env node

import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import whiteboardService from './lib/services/whiteboardService';

// Simple CLI argument parsing
function parseArgs() {
    const args = process.argv.slice(2);

    const showHelp = () => {
        console.log(`
iron-man - Generate whiteboard visualizations from code repositories

Usage: iron-man [options]

Options:
  -p, --path <directory>  Directory to process (defaults to current directory)
  -h, --help             Display this help message
  -v, --version          Display version number
`);
        process.exit(0);
    };

    const showVersion = () => {
        console.log('1.0.0');
        process.exit(0);
    };

    const getPath = (args: string[], index: number): string => {
        const nextIndex = index + 1;
        if (nextIndex >= args.length || !args[nextIndex]) {
            console.error('❌ --path requires a directory argument');
            process.exit(1);
        }
        return args[nextIndex];
    };

    return args.reduce((acc, arg, i) => {
        if (arg === '--help' || arg === '-h') showHelp();
        if (arg === '--version' || arg === '-v') showVersion();
        if (arg === '--path' || arg === '-p') {
            return { path: getPath(args, i) };
        }
        return acc;
    }, { path: process.cwd() });
}

async function main() {
    const options = parseArgs();
    const targetPath = path.resolve(options.path);

    // Check if the target directory exists
    if (!fs.existsSync(targetPath)) {
        console.error(`❌ Directory does not exist: ${targetPath}`);
        process.exit(1);
    }

    // Check if it's actually a directory
    const stat = fs.statSync(targetPath);
    if (!stat.isDirectory()) {
        console.error(`❌ Path is not a directory: ${targetPath}`);
        process.exit(1);
    }

    // Change to the target directory
    process.chdir(targetPath);

    // Load .env from the target directory
    const envPath = path.join(targetPath, '.env');
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log(`✅ Loaded .env from: ${envPath}`);
    } else {
        console.log(`⚠️  No .env file found in directory: ${targetPath}`);
        console.log('Please create a .env file with your GOOGLE_GENERATIVE_AI_API_KEY');
    }

    console.log(`🚀 Processing directory: ${targetPath}`);

    try {
        const result = await whiteboard.processDirectory();
        if (result) {
            console.log('✅ Whiteboard generation completed successfully!');
        } else {
            console.log('❌ Failed to generate whiteboard');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error processing directory:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});