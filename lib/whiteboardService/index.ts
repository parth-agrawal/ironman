import { runCli, type CliOptions } from 'repomix';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { whiteboardPrompt } from '../prompts.ts';

// Zod schema for JSON Canvas structure
const jsonCanvasSchema = z.object({
    canvas: z.object({
        nodes: z.array(z.object({
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
            backgroundStyle: z.enum(["cover", "ratio", "repeat"]).optional()
        })).optional(),
        edges: z.array(z.object({
            id: z.string(),
            fromNode: z.string(),
            fromSide: z.enum(["top", "right", "bottom", "left"]).optional(),
            fromEnd: z.enum(["none", "arrow"]).optional(),
            toNode: z.string(),
            toSide: z.enum(["top", "right", "bottom", "left"]).optional(),
            toEnd: z.enum(["none", "arrow"]).optional(),
            color: z.string().optional(),
            label: z.string().optional()
        })).optional()
    })
});

const whiteboardService = {
    processDirectory: async () => {
        // Process current directory with custom options
        async function packProject() {
            const options = {
                output: 'output.xml',
                style: 'xml',
                compress: true,
                quiet: true
            } as CliOptions;

            const result = await runCli(['.'], process.cwd(), options);
            if (result) {
                return result.packResult;
            }
            return null;
        }

        const result = await packProject();
        if (result) {
            // Extract the actual text content from PackResult
            const codebaseText = JSON.stringify(result)
            const canvas = await whiteboardService.getWhiteboardRaw(codebaseText);
            console.log(JSON.stringify(canvas, null, 2));
            return canvas;
        }
        return null;
    },
    getWhiteboardRaw: async (codebaseText: string) => {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
        }

        console.log('codebaseText', codebaseText)

        try {
            const { object } = await generateObject({
                model: google('gemini-2.0-flash-exp'),
                prompt: whiteboardPrompt(codebaseText),
                schema: jsonCanvasSchema,
                providerOptions: {
                    google: {
                        apiKey,
                    },
                },
            });

            return object.canvas;
        } catch (error) {
            console.error('Error generating whiteboard:', error);
            throw error;
        }
    }
}

export default whiteboardService;