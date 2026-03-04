import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import {  MousePointer2Icon } from "lucide-react";
import { useState } from "react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./actions";


export const ManualTriggerNode = memo((props : NodeProps) => {
    const [open, setOpen] = useState(false);
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : MANUAL_TRIGGER_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchManualTriggerRealtimeToken,
    });

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