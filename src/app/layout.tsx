"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import reduxStore from "@/lib/Redux/ReduxStore";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/ui/app-sidebar"
import Landingpage from "@/components/components/landingpage";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink, 
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut, 
  useUser, 
  UserButton,
} from '@clerk/nextjs'

const geistSans = localFont({
  // src: "/fonts/GeistVF.woff",
  src : "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function UserSync() {
  const { user, isLoaded } = useUser(); // Get user data and loading state from Clerk

  useEffect(() => {
    if (isLoaded && user) {
      // When user is loaded and signed in, sync with database
      const syncUser = async () => {
        try {
          const response = await fetch("/api/user/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }), // Send userId to API
          });
          const data = await response.json();
          if (!response.ok) {
            console.error("Failed to sync user:", data.error);
          } else {
            console.log("User synced successfully:", data);
          }
        } catch (error) {
          console.error("Error syncing user with database:", error);
        }
      };

      syncUser();
    }
  }, [isLoaded, user]); // Run effect when isLoaded or user changes

  return null; // This component doesn't render anything
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  

  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Collab-Sphere</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
            <SignedOut>
              {/* <SignInButton />
              <SignUpButton /> */}
              
              <Landingpage></Landingpage>
            </SignedOut>
            <SignedIn>
          <Provider store={reduxStore}>
          <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      
      <AppSidebar />
      <SidebarInset>
        {/* <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header> */}
        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          ))}
        </div> */}
        <div className="p-3">
        
             
            
        {children}</div>
      </SidebarInset>
    </SidebarProvider>
    <Toaster />
          </Provider>
          </SignedIn>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
