#!/usr/bin/env node
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import whiteboardService from './src/lib/services/whiteboardService';
import { startServer } from './src/lib/server';
// Simple CLI argument parsing
function parseArgs() {
    const args = process.argv.slice(2);
    const showHelp = () => {
        console.log(`
iron-man - Generate whiteboard visualizations from code repositories

Usage: iron-man [options]

Options:
  -p, --path <directory>  Directory to process (defaults to current directory)
  --serve                Start a web server to view the whiteboard (optional)
  --port <number>        Port for the web server (defaults to 3000, requires --serve)
  -h, --help             Display this help message
  -v, --version          Display version number
`);
        process.exit(0);
    };
    const showVersion = () => {
        console.log('1.0.0');
        process.exit(0);
    };
    const getPathArg = (args, index, flag) => {
        const nextIndex = index + 1;
        if (nextIndex >= args.length || !args[nextIndex] || args[nextIndex].startsWith('-')) {
            console.error(`❌ ${flag} requires a directory argument`);
            process.exit(1);
        }
        return args[nextIndex];
    };
    const getPortArg = (args, index, flag) => {
        const nextIndex = index + 1;
        if (nextIndex >= args.length || !args[nextIndex] || args[nextIndex].startsWith('-')) {
            console.error(`❌ ${flag} requires a port number`);
            process.exit(1);
        }
        const port = parseInt(args[nextIndex], 10);
        if (isNaN(port) || port <= 0 || port > 65535) {
            console.error(`❌ Invalid port number for ${flag}: ${args[nextIndex]}`);
            process.exit(1);
        }
        return port;
    };
    const options = args.reduce((acc, arg, i, arr) => {
        if (arg === '--help' || arg === '-h')
            showHelp();
        if (arg === '--version' || arg === '-v')
            showVersion();
        if (arg === '--path' || arg === '-p') {
            return { ...acc, path: getPathArg(arr, i, arg) };
        }
        if (arg === '--serve') {
            return { ...acc, serve: true };
        }
        if (arg === '--port') {
            return { ...acc, port: getPortArg(arr, i, arg) };
        }
        if (arg.startsWith('-') && i + 1 < arr.length && !arr[i + 1].startsWith('-')) {
        }
        else if (arg.startsWith('-')) {
            console.warn(`⚠️ Unknown option: ${arg}`);
        }
        return acc;
    }, { path: process.cwd(), serve: false, port: 3000 });
    if (options.port !== 3000 && !options.serve) {
        console.warn("⚠️ --port option is specified, but --serve is not. The server will not start.");
    }
    return options;
}
// Server function provided by user
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    // Change to the target directory for context, but .env loading is from there explicitly
    // process.chdir(targetPath); // This was original behavior. Let's see if needed.
    // whiteboardService and repomix might rely on cwd.
    // Load .env from the target directory
    const envPath = path.join(targetPath, '.env');
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log(`✅ Loaded .env from: ${envPath}`);
    }
    else {
        console.log(`⚠️  No .env file found in directory: ${targetPath}`);
        console.log('Please create a .env file with your GOOGLE_GENERATIVE_AI_API_KEY');
        // Consider exiting if API key is crucial and not found,
        // though whiteboardService.getWhiteboardRaw handles this.
    }
    console.log(`🚀 Processing directory: ${targetPath}`);
    try {
        // whiteboardService.processDirectory expects the targetPath
        const result = await whiteboardService.processDirectory(targetPath);
        if (result) {
            console.log('✅ Whiteboard generation completed successfully!');
            const canvasFilePath = path.join(targetPath, 'whiteboard.canvas');
            console.log(`Canvas data saved to ${canvasFilePath}`);
            if (options.serve) {
                console.log('Starting server as per --serve option...');
                try {
                    await startServer(result, options.port);
                    // The script will hang here due to startServer's unresolved promise, which is desired for a running server.
                }
                catch (serverError) {
                    console.error('❌ Server could not be started.', serverError);
                    process.exit(1); // Exit if server fails to start
                }
            }
            else {
                console.log("Whiteboard data generated. Run with --serve to start the web server.");
                process.exit(0); // Exit if not serving
            }
        }
        else {
            console.log('❌ Failed to generate whiteboard');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Error processing directory:', error);
        process.exit(1);
    }
}
main().catch((error) => {
    console.error('❌ Unexpected error in main:', error);
    process.exit(1);
});
