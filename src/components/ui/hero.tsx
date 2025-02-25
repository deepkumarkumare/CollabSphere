import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,  
    UserButton,
  } from '@clerk/nextjs'

export const Hero2 = () => (
  <div className="w-full mt-16">
    <div className="container mx-auto">
      <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
        <div>
          <Badge variant="outline">We&apos;re live!</Badge>
        </div>
        <div className="flex gap-4 flex-col">
          <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
            Lorem ipsum dolor sit amet consectetur 
          </h1>
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam, exercitationem maiores? Nemo labore neque suscipit ab debitis impedit esse quaerat itaque eius, aspernatur voluptas enim expedita veritatis?
          </p>
        </div>
        <div className="flex flex-row gap-3">
        <SignInButton><Button size="lg" className="gap-4" variant="outline">
            Sign in
            {/* <PhoneCall className="w-4 h-4" /> */}
          </Button></SignInButton>
          <SignUpButton><Button size="lg" className="gap-4">
            Sign up here 
            {/* <MoveRight className="w-4 h-4" /> */}
          </Button></SignUpButton>
        </div>
      </div>
    </div>
  </div>
);