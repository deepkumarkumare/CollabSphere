'use client';
import { Badge } from "@/components/ui/badge";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export const Feature5 = () => {

  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null); 
  const [image, setImage] = useState('');

  useEffect(() => {
    if (user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => setProfile(data));
    }
  }, [user]);


  return (
  <div className="w-[100%] my-20">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Moments</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
            🎉 Your Contributions So Far!
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
            Here's what you've shared with the community. Keep engaging! 😊
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            
          </div> */}

          {profile?.posts?.map((post: any) => (
            
          <div key={post._id} className="flex flex-col gap-2" >
           {post.image && <div className="bg-muted rounded-md aspect-video mb-2" style={{
    backgroundImage: `url(${post.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}></div>}
            
          </div>
          ))}
          {/* <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            
          </div> */}
        </div>
      </div>
    </div>
  </div>
  )
};




