import React, { Suspense } from 'react'
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import { WorkflowsContainer, WorkflowsError, WorkflowsList, WorkflowsLoading } from '@/features/workflows/components/workflows';
import { SearchParams } from 'nuqs/server';
import { loadWorkflowsParams } from '@/features/workflows/server/params-loader';

type Props = {
  searchParams : Promise<SearchParams>
}

const page = async({searchParams} : Props) => {
  await requireAuth();

  const params = await loadWorkflowsParams(searchParams);
  await prefetchWorkflows(params);
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError/>}>
            <Suspense fallback={<WorkflowsLoading/>}>
              <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
    
  )
}

export default page