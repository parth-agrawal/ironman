import { runCli, type CliOptions } from 'repomix';
import { createGoogleGenerativeAI, google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';



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
        console.log(result);
    },
    getWhiteboardRaw: async () => {
        const model = google('gemini-2.5-pro-preview-05-06');
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
        }

        const { text } = await generateText({
            model,
            prompt: 'Write a vegetarian lasagna recipe for 4 people.',
            providerOptions: {
                google: {
                    apiKey,
                },
            },
        });

        console.log(text);


    }


}

export default whiteboardService;