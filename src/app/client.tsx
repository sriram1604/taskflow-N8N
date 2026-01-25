"use client"


import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'

import { useTRPC } from '@/trpc/client'

export const Client = () => {
  const trpc = useTRPC();
  const {data : users, isLoading, error} = useSuspenseQuery(trpc.getUsers.queryOptions())
  return (
    <div>Client component : {JSON.stringify(users)} </div>
  )
}

