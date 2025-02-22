'use client';
import React from 'react'
import { Card } from '../ui/card'
import { Feature5 } from './postsection'
import { Feature6 } from './projectsection'
import { Badge } from '../ui/badge'
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

const Bio = () => { 

  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null); 


  useEffect(() => {
    if (user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => setProfile(data));
    }
  }, [user]);

  

  return (
    <div>
      {profile?.image &&
<Card
  style={{
    backgroundImage: `url(${profile.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
  className="h-36"
/>}

      <Card className='w-full my-3 p-[5%]'>
      <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left mb-5">
      Proficiencies :

            </h2>
            <div className='gap-4 flex flex-wrap'>
            {profile?.skills?.map((skill: any) => (
              
            <Badge key={skill._id} variant="secondary"  className="px-5 py-1 text-lg">{skill.name}</Badge>
          ))}
            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>

            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>

            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>
            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>
            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>

            </div>
            
      </Card>

      <Card className='w-full my-3 p-[5%]'>
      <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left mb-5">
      Fascinations :
            </h2>
            <div className='gap-4 flex flex-wrap'>
            {profile?.interests?.map((interest: any) => (
            <Badge key={interest._id} variant="secondary"  className="px-5 py-1 text-lg">{interest.name}</Badge>
          ))}
            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>

            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>

            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>
            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>
            <Badge variant="secondary"  className="px-5 py-1 text-lg">Skills</Badge>

            </div>
            
      </Card>
<Card className='my-3'>
    <div className=''>
      <Feature5 ></Feature5>
      </div>
      
      </Card>
      <Card>
    <div className=''>
      <Feature6 ></Feature6>
      </div>
      
      </Card>
      
    </div>
  )
}

export default Bio
