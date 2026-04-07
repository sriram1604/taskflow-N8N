import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

import { useState } from "react";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";


export const GoogleFormTriggerNode = memo((props : NodeProps) => {
    const [open, setOpen] = useState(false);


    const nodeStatus = useNodeStatus({
            nodeId : props.id,
            channel : GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
            topic : "status",
            refreshToken : fetchGoogleFormTriggerRealtimeToken,
    });

    const handleOpenSettings = () => {
        setOpen(true)
    }
    return(
        <>
        <GoogleFormTriggerDialog open={open} onOpenChange={setOpen}/>
        <BaseTriggerNode
            {...props}
            icon="/images/googleform.svg"
            name="Google Form"
            description="When a new response is submitted to a Google Form"
            status = {nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        
        </>
    )
})