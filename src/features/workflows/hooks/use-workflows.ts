"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useWorkflowsParams } from "./use-workflows-params"

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC()

    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
}

export const useCreateWorkflow = () => {
    
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.createWorkflow.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} created successfully`);
 
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
        },
        onError : (error) => {
            toast.error(`Error creating workflow : ${error.message}`);
        }
    }))
}

export const useRemoveWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.removeWorkflow.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} removed successfully`);

            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id : data.id}),)
        },
        onError : (error) => {
            toast.error(`Error removing workflow : ${error.message}`);
        }
    }))
}

export const useSuspenseWorkflow = (id : string) => {
    const trpc = useTRPC()

    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Workflow ${data.name} updated successfully`);

            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id : data.id}),)
        },
        onError : (error) => {
            toast.error(`Error updating workflow : ${error.message}`);
        }
    }))
}
