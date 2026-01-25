

import React, { Suspense } from "react"

import { Button } from "@/components/ui/button"
import db from "@/lib/db"
import { caller, getQueryClient, trpc } from "../trpc/server"
import {Client} from "./client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

type Props = {}

const page = async(props: Props) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<div>Loading...</div>}>
            <Client/>
          </Suspense>
        </HydrationBoundary>
    </div>
  )
}

export default page