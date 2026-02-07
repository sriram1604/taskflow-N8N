"use client"

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2, SaveIcon, WorkflowIcon } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

import { Input } from "@/components/ui/input";
import { useEffect,useState,useRef } from "react";
import Link from "next/link";
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { LoadingView } from "@/components/entity-components";

export const EditorHeader = ({workflowId} : {workflowId: string}) => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4
        bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadCrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    ) 
}

export const EditorBreadCrumbs = ({workflowId} : {workflowId: string}) => {
    return (
        <Breadcrumb className="p-3">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild href="/workflows">
                        <Link href="/workflows" prefetch>
                            
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export const EditorSaveButton = ({workflowId} : {workflowId: string}) => {
    return (
        <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={() => {}} disabled={false}>
                <SaveIcon className = "size-4" />
                Save
            </Button>
        </div>
    )
}

export const EditorNameInput = ({workflowId} : {workflowId: string}) => {
    const {data : workflow} = useSuspenseWorkflow(workflowId);
    const updateWorkflowName = useUpdateWorkflowName();


    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const isUpdating = updateWorkflowName.isPending;
    useEffect(()=>{
        if(workflow.name){
            setName(workflow.name);
        }
    },[workflow.name])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        
        if(name === workflow.name){
            setIsEditing(false);
            return;
        }
        setIsEditing(false);

        try {
            await updateWorkflowName.mutateAsync({id: workflowId, name});
        } catch (error) {
            setName(workflow.name);
        }
    }

    const handleCancel = () => {
        setName(workflow.name);
        setIsEditing(false);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    }
    if(isEditing){
        return (
            <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors">
                <Input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    disabled={isUpdating}
                    className="h-7 w-auto min-w-[100px] px-2"
                />
            </BreadcrumbItem>
        )
    }

    if(isUpdating){
        return (
            <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors">
                <Loader2 className="size-4 animate-spin text-primary" />
            </BreadcrumbItem>
        )
    }

    return (
        <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors"
        onClick={() => setIsEditing(true)}
        >
            {workflow.name}
        </BreadcrumbItem>
    )
}