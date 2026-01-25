
import db from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  getUsers: baseProcedure
    .query((opts) => {
      return db.user.findMany();
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;