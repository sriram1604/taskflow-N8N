import { requireAuth } from "@/lib/auth-utils";

interface ExecutionPageProps{
    params: Promise<{executionId: string}>;
}

const page = async ({params}: ExecutionPageProps) => {
    await requireAuth();
    const {executionId} = await params;
    return (
        <div>execution id : {executionId}</div>
    )
}

export default page
