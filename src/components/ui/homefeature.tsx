"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Feature2 = () => (
  <div className="w-full bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-12 py-12 lg:py-20">
        <div className="animate-fade-in">
          <Badge
            variant="outline"
            className="text-sm font-medium px-4 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-300"
          >
            Platform
          </Badge>
        </div>
        <div className="flex flex-col gap-6 text-center max-w-3xl mx-auto animate-fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Collaborate Smarter
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300">
            Many skilled professionals, freelancers, and hobbyists struggle to connect for projects. We fix that.
          </p>
        </div>
        <div className="w-full animate-fade-in-up">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Connect with Like-Minded People",
                desc: "Easily find professionals, freelancers, and hobbyists who share your interests and skills.",
              },
              {
                title: "Structured Collaboration",
                desc: "A platform designed to match you with the right collaborators, unlike general networking tools.",
              },
              {
                title: "Beyond Project Sharing",
                desc: "Go beyond repositories—discover teammates for side projects, startups, and creative work.",
              },
              {
                title: "Simplified Networking",
                desc: "Overcome the limitations of platforms like LinkedIn and Twitter with targeted tools.",
              },
              {
                title: "Effortless Discovery",
                desc: "Find collaborators quickly and efficiently, unlike GitHub’s basic sharing features.",
              },
              {
                title: "Tailored Matches",
                desc: "Get personalized recommendations based on your skills, interests, and project goals.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group flex flex-row gap-4 items-start p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <Check className="w-5 h-5 mt-1 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);