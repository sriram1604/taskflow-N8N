"use client"

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()

    return (
        <p>
            {JSON.stringify(workflows.data,null,2)}
        </p>
    )
}

export const WorkflowsSearch = () => {
    const [params,setParams] = useWorkflowsParams();
    const {searchValue,onSearchChange} = useEntitySearch({params,setParams});
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    )
}

export const WorkflowsHeader = ({disabled} : {disabled?:boolean}) => {
    const createWorkflow = useCreateWorkflow();
    const {handleError,modal} = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined,{
            onSuccess : (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError : (error) => {
                handleError(error);
            }
        })
    }
    return (
        <>
        {modal}
            <EntityHeader
                title="Workflows"
                description="Manage your workflows"
                
                newButtonLabel="Create Workflow"
                disabled={disabled}
                onNew={handleCreate}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

import { Suspense } from "react"

export const WorkflowsContainer = ({children} : {children:React.ReactNode}) => {
    return (
        <EntityContainer
        header={<WorkflowsHeader/>}
        search={<WorkflowsSearch/>}
        pagination={
            <Suspense fallback={<div className="h-[74px]"></div>}>
                <WorkflowsPagination />
            </Suspense>
        }
        >
            {children}
        </EntityContainer>
    )
}

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params,setParams] = useWorkflowsParams();
    return (
        <EntityPagination
            page={workflows.data.page}
            totalPages={workflows.data.totalPages}
            onPageChange={(page) => setParams({...params,page})}
            disabled={workflows.isFetching}
        />
    )
}