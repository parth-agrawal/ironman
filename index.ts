import whiteboardService from "./services/whiteboardService/index.ts";
import * as dotenv from 'dotenv';

dotenv.config();

// whiteboardService.processDirectory();
whiteboardService.getWhiteboardRaw();