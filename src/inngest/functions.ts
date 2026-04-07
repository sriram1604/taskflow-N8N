
import db from "@/lib/db";
import { inngest } from "./client";
import {NonRetriableError} from "inngest";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
//import { contextLinesIntegration } from "@sentry/nextjs";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";


export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" , retries : 0},
  { 
    event: "workflow/execute.workflow",
    channels : [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel()
    ],
  },
  async ({ event, step, publish }) => {
    
    const workflowId = event.data.workflowId;


    if(!workflowId){
      throw new NonRetriableError("Workflow ID is required");
    }

    const sortedNodes = await step.run("prepare-workflow", async() => {
      const workflow = await db.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};
    
    for(const node of sortedNodes){
        const executor = getExecutor(node.type as NodeType);

        context = await executor({
          data : node.data as Record<string,unknown>,
          nodeId : node.id,
          context,
          step,
          publish,
        })
    }

    return {
      workflowId,
      result : context,
    };
  },
);