import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import {  MousePointer2Icon } from "lucide-react";
import { useState } from "react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props : NodeProps) => {
    const [open, setOpen] = useState(false);
    const nodeStatus = "initial";

    const handleOpenSettings = () => {
        setOpen(true)
    }
    return(
        <>
        <ManualTriggerDialog open={open} onOpenChange={setOpen}/>
        <BaseTriggerNode
            {...props}
            icon={MousePointer2Icon}
            name="Manual Trigger"
            description="Trigger the workflow manually"
            status = {nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        
        </>
    )
})