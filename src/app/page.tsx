

import React from "react"

import { Button } from "@/components/ui/button"
import db from "@/lib/db"

type Props = {}

const page = async(props: Props) => {
  const users = await db.user.findMany();

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center'>
        {JSON.stringify(users)}
    </div>
  )
}

export default page