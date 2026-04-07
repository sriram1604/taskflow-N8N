"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateWorkflow } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateWorkflowDialog = ({ open, onOpenChange }: CreateWorkflowDialogProps) => {
  const [name, setName] = useState("");
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkflow.mutate(
      { name },
      {
        onSuccess: (data) => {
          onOpenChange(false);
          router.push(`/workflows/${data.id}`);
          setName(""); // reset on success
        },
        onError: (error) => {
          handleError(error);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setName("");
    }
  };

  return (
    <>
      {modal}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
            <DialogDescription>
              Give your new workflow a name to get started.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Workflow name..."
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createWorkflow.isPending}
                autoFocus
                minLength={1}
                maxLength={255}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createWorkflow.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createWorkflow.isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
