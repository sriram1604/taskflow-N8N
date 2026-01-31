"use client"

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";


export default function LogoutBtn() {
    return (
        <Button onClick={() => authClient.signOut()}>Logout</Button>
    )
}