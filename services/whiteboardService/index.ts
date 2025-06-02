import { runCli, type CliOptions } from 'repomix';
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

    }


}

export default whiteboardService;