
import db from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';
import { inngest } from '@/inngest/client';


export const appRouter = createTRPCRouter({
  testAi : protectedProcedure
  .mutation(async({ctx}) => {
    const data = await inngest.send({
        name : "execute/ai",
        
      });
      return {success : true,message : "Model works perfectly",data : data}
  }),
  getWorkflows: protectedProcedure
    .query(({ctx}) => {
      
      return db.workflow.findMany();
    }),
    createWorkflow: protectedProcedure
    .mutation(async({ctx}) => {
      await inngest.send({
        name : "test/hello.world",
        data: {
          email : " sriramvenkatesan1604@gmail.com"
        }
      });
      return {success : true,message : "Workflow created successfully"}
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;