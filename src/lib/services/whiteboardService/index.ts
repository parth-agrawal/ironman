import { runCli, type CliOptions } from "repomix";
import { google } from "@ai-sdk/google";
import { generateObject, generateText, jsonSchema } from "ai";
import { z } from "zod";
import { responseJsonSchema, whiteboardPrompt } from "../../prompts.js";
import path from "path";

// Zod schema for JSON Canvas structure
const responseZodSchema = z.object({
  canvas: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        type: z.enum(["text", "file", "link", "group"]),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        color: z.string().optional(),
        text: z.string().optional(),
        file: z.string().optional(),
        subpath: z.string().optional(),
        url: z.string().optional(),
        label: z.string().optional(),
        background: z.string().optional(),
        backgroundStyle: z.enum(["cover", "ratio", "repeat"]).optional(),
      })
    ),
    edges: z.array(
      z.object({
        id: z.string(),
        fromNode: z.string(),
        fromSide: z.enum(["top", "right", "bottom", "left"]).optional(),
        fromEnd: z.enum(["none", "arrow"]).optional(),
        toNode: z.string(),
        toSide: z.enum(["top", "right", "bottom", "left"]).optional(),
        toEnd: z.enum(["none", "arrow"]).optional(),
        color: z.string().optional(),
        label: z.string().optional(),
      })
    ),
  }),
});

const whiteboardService = {
  processDirectory: async (targetPath: string) => {
    console.log(`📁 Analyzing directory: ${targetPath}`);

    // Process current directory with custom options
    async function packProject() {
      const outputPath = path.join(targetPath, "summary-output.xml");
      const options = {
        style: "xml",
        compress: true,
        quiet: true,
      } as CliOptions;

      console.log("📦 Packing project files...");
      console.log("TARGET PATH", targetPath);
      const result = await runCli(["."], targetPath, options);
      if (result) {
        console.log(`✅ Project packed successfully`);
        return result.packResult;
      }
      return null;
    }

    const result = await packProject();
    if (result) {
      // Extract the actual text content from PackResult
      const codebaseText = JSON.stringify(result);
      console.log("🤖 Generating whiteboard visualization...");
      const canvas = await whiteboardService.getWhiteboardRaw(codebaseText);

      // Save the canvas to a file in the target directory
      const canvasPath = path.join(targetPath, "whiteboard.canvas");
      const fs = await import("fs/promises");
      await fs.writeFile(canvasPath, JSON.stringify(canvas, null, 2));
      console.log(`💾 Whiteboard saved to: ${canvasPath}`);

      return canvas;
    }
    return null;
  },
  getWhiteboardRaw: async (codebaseText: string) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set in .env file");
    }

    // Remove the console.log of codebaseText as it's too verbose
    console.log("📝 Sending codebase to AI for analysis...");

    try {
      const { object } = await generateObject({
        model: google("gemini-2.5-flash-preview-05-20"),
        prompt: whiteboardPrompt(codebaseText),
        schema: jsonSchema(responseJsonSchema),
        providerOptions: {
          google: {
            apiKey,
            thinkingConfig: {
              maxSteps: 0,
            },
          },
        },
      });
      //     model: google("gemini-2.5-flash-preview-05-20"),
      //     prompt: whiteboardPrompt(codebaseText),
      //     providerOptions: {
      //       google: {
      //         apiKey,
      //         thinkingConfig: {
      //           maxSteps: 0,
      //         },
      //       },
      //     },
      //   });
      console.log("✨ AI analysis completed!");
      return object;
    } catch (error) {
      console.error("❌ Error generating whiteboard:", error);
      throw error;
    }
  },
};

export default whiteboardService;
