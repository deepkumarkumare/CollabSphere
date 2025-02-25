import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'

const Communitysidebar = () => {
  return (
    <div>
      <Link href='/community' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Community</Link>
<Link href='/group-chat' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Group Chat</Link>

    </div>
  )
}

export default Communitysidebar
