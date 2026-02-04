import { requireAuth } from "@/lib/auth-utils";

interface CredentialPageProps{
    params: Promise<{credentialId: string}>;
}

const page = async ({params}: CredentialPageProps) => {
    await requireAuth();
    const {credentialId} = await params;
    return (
        <div>credentials id : {credentialId}</div>
    )
}

export default page
