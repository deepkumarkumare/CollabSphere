"use client";

import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
} from '@clerk/nextjs';

export const Hero2 = () => (
  <div className="w-full mt-16 bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-8 py-12 lg:py-20 text-center">
        <div className="animate-fade-in">
          <Badge
            variant="outline"
            className="text-sm font-medium px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-300"
          >
            We're live!
          </Badge>
        </div>
        <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            <span className="text-indigo-600 dark:text-indigo-400">COLLAB-SPHERE!</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
            A platform that helps users find the right people and right projects for collaboration based on their skills and interests.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
          <SignInButton>
            <Button
              size="lg"
              variant="outline"
              className="group px-6 py-3 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign in
              <PhoneCall className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              size="lg"
              className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 text-white hover:from-indigo-600 hover:to-indigo-800 dark:hover:from-indigo-700 dark:hover:to-indigo-900 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign up here
              <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  </div>
);