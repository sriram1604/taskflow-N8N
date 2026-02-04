"use client"



import {
    CreditCardIcon,
    FolderOpenIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,
} from "lucide-react"


import Image from "next/image"
import Link from "next/link"
import { usePathname,useRouter } from "next/navigation"
import { useState } from "react"
import{
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
}from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client"
import { hasUserSubscription } from "@/features/subscription/hooks/use-subscription"


const menuItems=[
    {
        title: "Mainmenu",
        items : [

            {
                title:"workflows",
                url:"/workflows",
                icon:FolderOpenIcon,
            },
            {
                title: "Credentials",
                url:"/credentials",
                icon:KeyIcon,
            },
            {
                title: "Executions",
                url:"/executions",
                icon:HistoryIcon,
            }

            
        ]
    }

];

export const AppSidebar=()=>{
    const router = useRouter();
    const pathname = usePathname();
    const {hasActiveSubscription,isLoading} = hasUserSubscription();
    return(
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                        <Link href="/workflows" prefetch>
                            <Image src="/images/logo.svg" alt="logo" width={30} height={30} />
                            <span className="text-sm font-semibold">TaskFlow</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => {
                    return(
                        <SidebarGroup key={group.title}>
                            <SidebarGroupContent>
                                
                                    <SidebarMenu>
                                        {group.items.map((item) => {
                                        
                                        return(
                                            
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton
                                                    tooltip={item.title}
                                                    isActive={
                                                        item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
                                                    }
                                                    asChild
                                                    className="gap-x-4 h-10 px-4"
                                                    >
                                                    <Link href={item.url} prefetch>
                                                        <item.icon />
                                                        {item.title}
                                                    </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                        )
                                    })}
                                    </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    )
                })
                }
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {!hasActiveSubscription && !isLoading && <SidebarMenuButton
                            tooltip="Upgrade to Pro"
                            onClick={() => {authClient.checkout({slug : "Taskflow-pro"})}}
                            className="gap-x-4 h-10 px-4"
                            >
                                <CreditCardIcon />
                                Upgrade to Pro
                            </SidebarMenuButton>
                        }
                        <SidebarMenuButton
                        tooltip="Billing portal"
                        onClick={() => {authClient.customer.portal()}}
                        className="gap-x-4 h-10 px-4"
                        >
                          <CreditCardIcon />
                          Billing portal
                        </SidebarMenuButton>
                        <SidebarMenuButton
                        tooltip="Logout"
                        onClick={() => {authClient.signOut({
                            fetchOptions:{
                                onSuccess:()=>{
                                    router.push("/login")
                                }
                            }
                        })}}
                        className="gap-x-4 h-10 px-4"
                        >
                          <LogOutIcon />
                          Logout
                        </SidebarMenuButton>
                        
                    </SidebarMenuItem>
                </SidebarMenu>
                
            </SidebarFooter>
        </Sidebar>
    )
}  