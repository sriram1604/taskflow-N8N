"use client"

import LogoutBtn from "@/components/predesigns/logoutBtn";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils"
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const page = () => {
   
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const {data } = useQuery(trpc.getWorkflows.queryOptions())
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess : () => {
      toast.success("Text created");
    },
    onError : () => {
      toast.error("error occured");
    }
  }))
  // const create = useMutation(trpc.createWorkflow.mutationOptions({
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
  //   },
  //   onError: () => {
  //     console.log("error")
  //   }
  // }))

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6'>
        
      protected page

      {/* <div>
        {create.isPending ? "Creating..." : (create.error ? "Error" : JSON.stringify(data,null,2))}
      </div> */}
      <div>
        {testAi.isPending ? "Testing..." : (testAi.error ? "Error" : JSON.stringify(testAi.data,null,2))}
      </div>
      {/* <Button disabled={create.isPending} onClick={() => create.mutate()}>Create</Button> */}
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>Test Ai</Button>
      <LogoutBtn />
    </div>
  )
}

export default page