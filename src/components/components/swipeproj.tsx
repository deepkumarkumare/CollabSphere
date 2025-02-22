import React from 'react'
import { Button } from "../ui/button"
import { Badge } from "@/components/ui/badge"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const Swipeproj = () => {
  return (
    <div>
            <Card>
  <div className='flex'>
    <Card className='flex-1 m-2 p-5 relative'>
        <Card 
        style={{
          backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG2gendwSeTzW7uJwCNkjlsaYjQFA_MX2_fg&s')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} className='h-32 mb-5'></Card>
    <CardTitle className='mb-5 mx-5' >Skills :</CardTitle>
        <div className='flex gap-3 flex-wrap'>
        <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge> 
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
        </div>

        <CardTitle className='m-5' >Interests :</CardTitle>
        <div className='flex gap-3 flex-wrap'>
        <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge> 
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
    <Badge variant="outline">Badge</Badge>
        </div>

        <CardFooter className='bottom-0 flex gap-3 absolute'  > 
        <CardTitle className='m-5' >Social Grid Community :</CardTitle>
        <Button variant="outline">Linkedin</Button>
        <Button variant="outline">Github</Button>
        <Button variant="outline">Gmail</Button>
        </CardFooter>
    
    </Card>
    <Card className='flex-1 m-2 p-2 gap-3'>
        <Card style={{
    backgroundImage: `url('https://pbs.twimg.com/media/FwbsBWVXoA4jAsb?format=jpg&name=4096x4096')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }} className='h-52 mb-2'></Card>
        <Card>
        <CardTitle className='p-5' >Project Description :</CardTitle>
        <div className='p-5 pt-0 text-sm'>  
        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
        </div>
        <Button className='mb-5 mx-5 w-[90%]' variant="outline">Go to Project</Button>
        </Card>
    </Card>
  </div>
  <CardFooter className="gap-4 justify-between">
    <div className='gap-4 flex'>
  <Button variant="outline">Contact</Button>
  <Button variant="outline">Join</Button></div> 
  <Button variant="outline">Skip</Button>
  </CardFooter>
</Card>
    </div>
  )
}

export default Swipeproj


// import React from 'react'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card"

// import { Card } from "@/components/ui/card"
  

// const Swipeproj = () => {
//   return (
//     <div>
//       <Card>
//   <CardHeader>
//     <CardTitle>Card Title</CardTitle>
//     <CardDescription>Card Description</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <p>Card Content</p>
//   </CardContent>
//   <CardFooter>
//     <p>Card Footer</p>
//   </CardFooter>
// </Card>

//     </div>
//   )
// }

// export default Swipeproj
