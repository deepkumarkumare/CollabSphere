import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'

const Threadsidebar = () => {
  return (
    <div>
      <Link href='/thread' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Threads</Link>
<Link href='/profile' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Profile</Link>
{/* <Link href='#' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>posts</Link>
<Link href='/bio/projects' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Projects</Link>
<Link href='#' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Social</Link> */}
    </div>
  )
}

export default Threadsidebar
