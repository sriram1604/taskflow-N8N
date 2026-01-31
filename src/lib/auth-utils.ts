
import { headers } from "next/headers";

import { redirect } from "next/navigation";

import {authClient} from "./auth";


export const requireAuth = async () => {
    const session = await authClient.api.getSession({
        headers : await headers(),
    });
    if (!session) {
        redirect("/login");
    }

    return session
}
export const requireUnAuth = async () => {
    const session = await authClient.api.getSession({
        headers : await headers(),
    });
    if (session) {
        redirect("/");
    }

    return session;
}