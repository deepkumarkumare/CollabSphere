"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./dark-toggle";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
} from '@clerk/nextjs';
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export const Header1 = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Collab-Sphere
            </span>
          </Link>
        </div>

        {/* Right Side Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ModeToggle />
          <div className="border-r h-6 mx-2"></div>
          <SignInButton>
            <Button variant="outline" size="sm">Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button size="sm">Get started</Button>
          </SignUpButton>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-background shadow-lg py-4 px-4 md:hidden">
            <div className="flex flex-col gap-4">
              <SignInButton>
                <Button variant="outline" className="w-full">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button className="w-full">Get started</Button>
              </SignUpButton>
              <ModeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};