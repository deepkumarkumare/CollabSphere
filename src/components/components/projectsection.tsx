'use client';
import { Badge } from "@/components/ui/badge";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from "next/link";

export const Feature6 = () => {

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
  <div className="w-[100%] my-20">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 flex-col items-start">
        <div>
            <Badge>Submissions</Badge>
          </div>
          
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
            💡 Your Creative Space
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
            These are the projects you’ve brought to life. Keep innovating! ✨
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {profile?.projects?.map((project: any) => (
          <Link key={project._id} href={project.projectLink || '#'} >
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2" style={{
    backgroundImage: `url(${project.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}></div>
            {/* <h3 className="text-xl tracking-tight">Pay supplier invoices</h3> */}
            <p className="text-muted-foreground text-base">
            {project.title}
            </p>
          </div>
          </Link>
          ))}
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            {/* <h3 className="text-xl tracking-tight">Pay supplier invoices</h3> */}
            <p className="text-muted-foreground text-base">
              Our goal is to streamline SMB trade, making it easier and faster
              than ever.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            {/* <h3 className="text-xl tracking-tight">Pay supplier invoices</h3> */}
            <p className="text-muted-foreground text-base">
              Our goal is to streamline SMB trade, making it easier and faster
              than ever.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            {/* <h3 className="text-xl tracking-tight">Pay supplier invoices</h3> */}
            <p className="text-muted-foreground text-base">
              Our goal is to streamline SMB trade, making it easier and faster
              than ever.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            {/* <h3 className="text-xl tracking-tight">Pay supplier invoices</h3> */}
            <p className="text-muted-foreground text-base">
              Our goal is to streamline SMB trade, making it easier and faster
              than ever.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-muted rounded-md aspect-video mb-2"></div>
            {/* <h3 className="text-xl tracking-tight">Pay supplier invoices</h3> */}
            <p className="text-muted-foreground text-base">
              Our goal is to streamline SMB trade, making it easier and faster
              than ever.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>)
};