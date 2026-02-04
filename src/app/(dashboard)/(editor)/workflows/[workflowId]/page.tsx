import { requireAuth } from "@/lib/auth-utils";

interface WorkflowPageProps{
    params: Promise<{workflowId: string}>;
}

const page = async ({params}: WorkflowPageProps) => {
    await requireAuth();
    const {workflowId} = await params;
    return (
        <div>workflow id : {workflowId}</div>
    )
}

export default page
