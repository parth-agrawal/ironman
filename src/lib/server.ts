import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import whiteboardService from "./services/whiteboardService/index.js";
import { CanvasContent } from "../frontend/src/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startServer(
  canvasData: any,
  port: number,
  targetPath: string
) {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());

  const frontendDistPath = path.join(__dirname, "..", "..", "frontend-dist");

  if (!fs.existsSync(frontendDistPath)) {
    console.error(`⚠️ Frontend not found at: ${frontendDistPath}`);
  } else {
    // Serve static files
    app.use(express.static(frontendDistPath));
  }

  // API endpoint
  app.get("/api/canvas-content", (req, res) => {
    res.json(canvasData);
  });

  app.post("/api/save", async (req, res) => {
    const canvas: CanvasContent = req.body;
    console.log("canvas", canvas);
    await whiteboardService.saveWhiteboard(canvas, targetPath);
    res.status(200).send("Whiteboard saved");
  });

  // Catch-all route for SPA (fix the Express 5.x issue)
  app.use((req, res) => {
    const indexPath = path.join(frontendDistPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend not available");
    }
  });

  app.listen(port, () => {
    console.log(`🚀 Whiteboard server running at http://localhost:${port}`);
    console.log("Press Ctrl+C to stop");
  });
}
