import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'

const Matchsidebar = () => {
  return (
    <div>
      <Link href='/match' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Match</Link>
<Link href='/search-profiles' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Search</Link>
{/* <Link href='#' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>posts</Link>
<Link href='/bio/projects' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Projects</Link>
<Link href='#' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Social</Link> */}
    </div>
  )
}

export default Matchsidebar
