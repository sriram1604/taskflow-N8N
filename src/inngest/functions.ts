import db from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching-data", "5s");
    await step.sleep("transcribing","5s");
    await step.sleep("summarizing","5s");
    await step.sleep("generating-content","5s");
    await step.sleep("saving-content","5s");
    return db.workflow.create({
        data: {
          name: "New Workflow",
          
        },
      });
  },
);