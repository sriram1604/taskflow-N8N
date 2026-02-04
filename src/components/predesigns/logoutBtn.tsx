"use client"

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";


export default function LogoutBtn() {
    return (
        <Button onClick={() => authClient.signOut()}><LogOutIcon />Logout</Button>
    )
}