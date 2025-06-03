import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer(canvasData: any, port: number) {
    const app = express();

    // Serve built frontend files
    const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(frontendDistPath));

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