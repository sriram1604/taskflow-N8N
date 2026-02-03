import db from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI();

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("fetching-data", "5s");
    const {text} = await step.ai.wrap("google-gemini-text",generateText,{
      model : google("gemini-2.5-flash"),
      system : "You are a helpful assistant.",
      prompt : "what is java?",

    });
    return {text}
  },
);