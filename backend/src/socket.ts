import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { appOpt } from "./configs/corsOpts";
import { retryGeminiResponse } from "./utils/gemini";
import { logger } from "./utils/logger";
import { model } from "./configs/genAI";

const cleanupGeminiResponse = (response: string): string => {
  let cleanedResponse = response.replace(/^Received response:\s*/, "");

  cleanedResponse = cleanedResponse.replace(/^```json\s*/, "");
  cleanedResponse = cleanedResponse.replace(/\s*```$/, "");

  return cleanedResponse.trim();
};

const generateProjectPrompt = (message: string) => {
  return `
Based on this user request: "${message}", I need to create a project with tasks. 
Extract the project name, description, status (active/completed), priority (low/moderate/high), and deadline (use a reasonable date in ISO format). 
Also extract tasks that should be created for this project,all the tasks must me to do.

Respond with valid JSON data ONLY in this exact format:
{
  "project": {
    "name": "Project name here",
    "description": "Project description here",
    "status": "active",
    "priority": "low|moderate|high",
    "deadline": "YYYY-MM-DD"
  },
  "tasks": [
    {
      "name": "Task 1",
      "description": "Task 1 description",
      "status": "todo|inProgress|completed",
      "priority": "low|moderate|high",
      "deadline": "YYYY-MM-DD"
    }
    // Additional tasks
  ]
}

Make sure the response is valid JSON and contains realistic data with appropriate deadlines.
dont add like Received response: and markdown code format 
`;
};

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, { cors: appOpt });

  io.on("connection", (socket) => {
    socket.on("ask-gemini", async ({ message }) => {
      try {
        let response;
        if (message.toLowerCase().startsWith("i want to create project")) {
          logger.info({}, `Processing project creation request: ${message}`);
          try {
            const prompt = generateProjectPrompt(message);
            logger.info({}, `Using prompt: ${prompt}`);

            const result = await model.generateContent({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
            });

            const generatedText = result?.response?.text?.();
            if (generatedText) {
              const cleanedResponse = cleanupGeminiResponse(generatedText);
              response = cleanedResponse;
            } else {
              logger.warn(
                {},
                "No response text returned from Gemini for project creation"
              );
              response =
                "Sorry, I couldn't generate project data. Please try again with more details.";
            }
          } catch (err) {
            logger.error(err, "Project creation AI error");
            response =
              "Sorry, I couldn't process your project creation request. Please try again.";
          }
        } else {
          const rawResponse = await retryGeminiResponse(message);
          response = rawResponse
            ? cleanupGeminiResponse(rawResponse)
            : rawResponse;
        }

        socket.emit("gemini-response", { response });
      } catch (err) {
        logger.error(err, "Gemini socket error");

        socket.emit("gemini-response", {
          response:
            "_Sorry, Gemini is temporarily unavailable. Please try again later._",
        });
      }
    });

    socket.on("disconnect", () => logger.info({}, "socket is disconnected"));
  });

  return io;
};
