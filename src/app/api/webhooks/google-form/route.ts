import { sendWorkflowExecution } from "@/inngest/utils";
import {type NextRequest, NextResponse} from "next/server";

export async function POST(request : NextRequest){
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        console.log(`Workflow ID : ${workflowId}`);

        if(!workflowId){
            return NextResponse.json(
                { success : false , message : "Workflow ID is required"},
                {status : 400}
            );
        };

        const body = await request.json();
        console.log(`Body in google form trigger : ${body}`);

        const formData = {
            formId : body.formId,
            formTitle : body.formTitle,
            responseId : body.responseId,
            timestamp : body.timestamp,
            respondentEmail : body.respondentEmail,
            responses : body.responses,
            raw : body,
        }
        
        await sendWorkflowExecution({
            workflowId,
            initialData : {
                googleForm : formData,
            },
        });

        return NextResponse.json({message : "success"});
    } catch (error) {
        console.error(`Error in google form trigger : ${error}`);
        return NextResponse.json(
            { success : false , message : "Failed to process google form" , error : error},
            {status : 500}
        );
    }
}