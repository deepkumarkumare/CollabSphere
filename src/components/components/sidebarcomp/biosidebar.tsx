import React from 'react'
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link'

const Biosidebar = () => {
  return (
    <div>
      <Link href='/bio' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Bio</Link>
<Link href='/bio/profile' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Profile</Link>
<Link href='/bio/posts' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>posts</Link>
<Link href='/bio/projects' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Projects</Link>
<Link href='/bio/social' className={`${buttonVariants({ variant: "outline" })} w-[90%] m-[5%] my-2`}>Social</Link>
    </div>
  )
}

export default Biosidebar
