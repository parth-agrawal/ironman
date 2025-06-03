import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startServer(canvasData: any, port: number) {
    const app = express();

    // In compiled version, frontend will be at bin/frontend-dist/
    const frontendDistPath = path.join(__dirname, '..', '..', 'frontend-dist');

    console.log(`Looking for frontend at: ${frontendDistPath}`);

    if (!fs.existsSync(frontendDistPath)) {
        console.error(`⚠️ Frontend not found at: ${frontendDistPath}`);
    } else {
        // Serve static files
        app.use(express.static(frontendDistPath));
    }

    // API endpoint
    app.get('/api/canvas', (req, res) => {
        res.json(canvasData);
    });

    // Catch-all route for SPA (fix the Express 5.x issue)
    app.use((req, res) => {
        const indexPath = path.join(frontendDistPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('Frontend not available');
        }
    });

    app.listen(port, () => {
        console.log(`🚀 Whiteboard server running at http://localhost:${port}`);
        console.log('Press Ctrl+C to stop');
    });
}