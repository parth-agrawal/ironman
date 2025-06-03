import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startServer(canvasData: any, port: number) {
    const app = express();

    // Serve built frontend files
    const projectRoot = path.resolve(__dirname, '..');
    const frontendDistPath = path.join(projectRoot, 'frontend', 'dist');
    console.log(`Attempting to serve frontend from: ${frontendDistPath}`);


    if (!fs.existsSync(frontendDistPath) || !fs.statSync(frontendDistPath).isDirectory()) {
        console.error(`❌ Frontend dist directory not found or is not a directory at: ${frontendDistPath}`);
        console.error(`Please ensure you have built the frontend. Expected location: '${path.join(projectRoot, 'frontend')}' then run 'npm run build' inside it.`);
    } else {
        app.use(express.static(frontendDistPath));
    }

    // API endpoint for canvas data
    app.get('/api/canvas', (req, res) => {
        res.json(canvasData);
    });

    // Fallback to index.html for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });

    app.listen(port, () => {
        console.log(`🚀 Whiteboard server running at http://localhost:${port}`);
        console.log('Press Ctrl+C to stop');
    });
}