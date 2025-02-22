'use client'
import { clsx, type ClassValue } from "clsx";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export function cn(...classes: any[]) {
  return twMerge(clsx(...classes));
}

export function useHandleOpenPost() {
  const router = useRouter();

  const handleOpenPost = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  return handleOpenPost;
}
