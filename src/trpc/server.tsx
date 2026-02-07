import 'server-only';
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createTRPCContext);

export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1] ?. type === 'infinite') {
        await queryClient.prefetchInfiniteQuery(queryOptions as any);
    } 
    else {
        await queryClient.prefetchQuery(queryOptions);
    }
}

export function HydrateClient(props: { children: React.ReactNode }) {
      const queryClient = getQueryClient();
      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
        {props.children}
        </HydrationBoundary>
      );
}