
import db from '@/lib/db';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { inngest } from '@/inngest/client';
import { workflowRouter } from '@/features/workflows/server/routers';


export const appRouter = createTRPCRouter({
  workflows : workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;