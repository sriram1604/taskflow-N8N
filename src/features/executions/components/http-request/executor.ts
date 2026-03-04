
import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions} from "ky";


Handlebars.registerHelper("json",(context) => {
    const stringify = JSON.stringify(context,null,2)
    const safeStringify = new Handlebars.SafeString(stringify)
    return safeStringify;
});


type HttpRequestData = {
    variableName : string;
    endpoint : string;
    method : "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body? : string;
}



export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
}) => {
    if(!data.endpoint){
        throw new NonRetriableError("HTTP Request node : No endpoint configured");
    }

    if(!data.variableName){
        throw new NonRetriableError("HTTP Request node : No variable name configured");
    }

    if(!data.method){
        throw new NonRetriableError("HTTP Request node : No method configured");
    }

    const result = await step.run("http-request",async() => {
        //http:://..../{{variables.id}}
        const endpoint = Handlebars.compile(data.endpoint)(context);

        //console.log(`Endpoint : ${endpoint}` )
        const method = data.method;


        const options : KyOptions = {method};

        if(["POST","PATCH","PUT"].includes(method)){

            const resolve = Handlebars.compile(data.body || "{}")(context);

            JSON.parse(resolve);

            options.body = resolve;
            options.headers = {
                "Content-Type" : "application/json",
            }
            
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();


        const responsePayload = {
            httpResponse : {
                status : response.status,
                statusText : response.statusText,
                data : responseData,
            },
        }

        
        return{
            ...context,
            [data.variableName] : responsePayload,
        }
        

        

    });

    

    return result;
}