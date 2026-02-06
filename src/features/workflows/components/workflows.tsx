"use client"
import { formatDistanceToNow } from 'date-fns';
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import { Empty, EmptyContent, EmptyDescription, EmptyTitle, EmptyHeader, EmptyMedia } from "@/components/ui/empty"
import { SearchXIcon, WorkflowIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Workflow } from "@/generated/prisma"

export const WorkflowsList = () => {
    
    const workflows = useSuspenseWorkflows()
    const [params,setParams] = useWorkflowsParams();

    if(workflows.data.items.length === 0){
        if(params.search){
            return <WorkflowsSearchEmpty search={params.search} onClear={() => setParams({search:""})}/>
        }
        return <WorkflowsEmpty/>
    }

    return (
        
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => (
                <WorkflowItems data={workflow}/>
            )}
            emptyView={<WorkflowsEmpty/>}
        />
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
        search={
            <Suspense fallback={<div className="h-[74px]"></div>}>
                <WorkflowsSearch/>
            </Suspense>
        }
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


export const WorkflowsLoading = () => {
    return (
       <LoadingView entity="Workflows..."/>
    )
}

export const WorkflowsError = () => {
    return (
       <ErrorView message="Failed to load workflows"/>
    )
}

export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow();
    const {handleError,modal} = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined,{
            
            onError : (error) => {
                handleError(error);
            },
            onSuccess : (data) => {
                router.push(`/workflows/${data.id}`)
            }
        })
    }
    
    return (
       <>
       {modal}
        <EmptyView 
            entity="workflows" 
            message="You haven't created any workflows yet. Get started by creating your first workflow"
            onNew={handleCreate}
            
            />
       </>
    )
}

export const WorkflowsSearchEmpty = ({search,onClear} : {search:string,onClear:() => void}) => {
    return (
        <Empty className="border border-dashed bg-white">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <SearchXIcon className=""/>
                </EmptyMedia>
            </EmptyHeader>
            <EmptyContent>
                <EmptyTitle>No items found</EmptyTitle>
                <EmptyDescription>
                   No items found matching "{search}". Try adjusting your search or filters.
                </EmptyDescription>

                <EmptyContent>
                        <Button size="sm" variant="outline" onClick={onClear}>
                            Clear Search
                        </Button>
                </EmptyContent>
            </EmptyContent>
        </Empty>
    )
}

export const WorkflowItems = ({
    data,

} : {
    data : Workflow
}) => {
    const removeWorkflow = useRemoveWorkflow();
    const handleRemove = () => {
        removeWorkflow.mutate({id : data.id});
    }
    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            key={data.id}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull;{" "} Created {" "}{formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
           image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground"/>
                </div>
           } 
           onRemove={handleRemove}
           isRemoving={removeWorkflow.isPending}
        />
    )
}