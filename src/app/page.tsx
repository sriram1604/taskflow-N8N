import LogoutBtn from "@/components/predesigns/logoutBtn";
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server";


const page = async() => {
   
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6'>
        
      protected page

      <div>
        {JSON.stringify(data,null,2)}
      </div>
      <LogoutBtn />
    </div>
  )
}

export default page