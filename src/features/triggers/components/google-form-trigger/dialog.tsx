"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { generateGoogleFormScript } from "./utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const steps = [
    {
        number: 1,
        title: "Open your Google Form",
        description: "Go to Google Forms and open the form you want to connect.",
    },
    {
        number: 2,
        title: "Open the Script Editor",
        description: 'Click the three-dots menu (⋮) at the top right, then select "Script editor".',
    },
    {
        number: 3,
        title: "Paste the webhook script",
        description: 'Delete any existing code, paste the Google Apps Script below, and replace WEBHOOK_URL with your webhook URL.',
    },
    {
        number: 4,
        title: "Save the script",
        description: 'Press Ctrl+S (or ⌘S on Mac) to save. Give the project a name if prompted.',
    },
    {
        number: 5,
        title: 'Add a form submit trigger',
        description: 'Click "Triggers" (clock icon) → "Add Trigger". Set event source to "From form" and event type to "On form submit". Click Save.',
    },
    {
        number: 6,
        title: "Authorize and test",
        description: 'Authorize the script when prompted, then submit a test response in your form to verify the trigger works.',
    },
];



export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const [copied, setCopied] = useState(false);
    const [scriptCopied, setScriptCopied] = useState(false);

    const workflowId = params.workflowId as string;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const copyWebhookUrl = () => {
        try {
            navigator.clipboard.writeText(webhookUrl);
            setCopied(true);
            toast.success("Webhook URL copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy webhook URL");
        }
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <div className="flex items-center justify-center size-10 rounded-lg bg-muted shrink-0">
                        <img
                            src="/images/googleform.svg"
                            alt="Google Form"
                            className="size-6"
                        />
                    </div>
                    <DialogHeader className="gap-0.5 text-left">
                        <DialogTitle className="text-base">Google Form Trigger</DialogTitle>
                        <DialogDescription className="text-xs">
                            Trigger this workflow when a form response is submitted.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable body */}
                <ScrollArea className="max-h-[70vh] w-full">
                    <div className="px-6 py-5 space-y-5 w-full overflow-hidden">

                        {/* Webhook URL */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Webhook URL
                            </Label>
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1 min-w-0">
                                    <Input
                                        id="webhookUrl"
                                        type="text"
                                        value={webhookUrl}
                                        readOnly
                                        className="font-mono text-xs pr-2 truncate bg-muted/50 border-dashed"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0"
                                    onClick={copyWebhookUrl}
                                    title="Copy webhook URL"
                                >
                                    {copied
                                        ? <CheckIcon className="size-4 text-green-500" />
                                        : <CopyIcon className="size-4" />
                                    }
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                                Paste this URL into your Google Apps Script to send form data to this workflow.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t" />

                        {/* Setup Steps */}
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Setup Instructions
                            </Label>

                            <ol className="space-y-3">
                                {steps.map((step) => (
                                    <li key={step.number} className="flex gap-3">
                                        <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                                            {step.number}
                                        </span>
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-sm font-medium leading-snug">{step.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed wrap-break-word">
                                                {step.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Divider */}
                        <div className="border-t" />

                        {/* Apps Script snippet */}
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Google Apps Script
                                </Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 gap-1.5 text-xs"
                                    onClick={async() => {
                                        const script = generateGoogleFormScript(webhookUrl);
                                        try {
                                            await navigator.clipboard.writeText(script);
                                            setScriptCopied(true);
                                            setTimeout(() => setScriptCopied(false), 2000);
                                            toast.success("Script copied to clipboard");
                                        } catch (error) {
                                            console.error("Failed to copy script:", error);
                                            toast.error("Failed to copy script");
                                        }
                                    }}
                                >
                                    {scriptCopied
                                        ? <><CheckIcon className="size-3.5 text-green-500" /> Copied!</>
                                        : <><CopyIcon className="size-3.5" /> Copy script</>
                                    }
                                </Button>
                            </div>
                            <div className="rounded-md border bg-muted/40 overflow-x-auto w-full">
                                <pre className="text-[11px] leading-relaxed text-muted-foreground p-4 whitespace-pre-wrap break-all font-mono">
                                    {generateGoogleFormScript(webhookUrl)}
                                </pre>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                                The script will be pre-filled with your webhook URL when you copy it.
                            </p>
                        </div>
                        {/* Footer hint */}
                        <div className="rounded-md bg-blue-500/10 border border-blue-500/20 px-4 py-3 flex gap-2.5 items-start">
                            <ExternalLinkIcon className="size-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                Need help?{" "}
                                <a
                                    href="https://developers.google.com/apps-script/guides/triggers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 font-medium hover:opacity-80"
                                >
                                    Read the Google Apps Script triggers guide
                                </a>
                                .
                            </p>
                        </div>

                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Available Variables</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.respondentEmail}}"}
                                    </code>{" - "}
                                    <span className="text-xs text-muted-foreground">Respondent Email</span>
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.responses['Question Name']}}"}
                                    </code>{" - "}
                                    <span className="text-xs text-muted-foreground">Specific Question Response</span>
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json googleForm.responses}}"}
                                    </code>{" - "}
                                    <span className="text-xs text-muted-foreground">All responses as JSON</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};