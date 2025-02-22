"use client";

import Link from "next/link";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import logo from "../assets/logo.png";
import { ModeToggle } from "./ui/dark-toggle";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import reduxStore, { RootState } from "@/lib/Redux/ReduxStore";
import { getMyData } from "@/lib/Redux/PostsSlice";
import { usePathname } from "next/navigation";
import { clearUserData } from "@/lib/Redux/AuthSlice";

export function Navbar() {
  const dispatch = useDispatch<typeof reduxStore.dispatch>();
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const myInfo = useSelector((state: RootState) => state.posts.myInfo);
  const currentPath = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const handleLogout = () => {
    dispatch(clearUserData());
  };

  useEffect(() => {
    if (isAuth) {
      dispatch(getMyData());
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between md:fixed top-0 w-full z-10 px-4 py-2 border-b dark:bg-black bg-white">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logo} alt="Yap Logo" width={40} height={40} />
          <span className="font-bold text-3xl italic text-blue-400">Yap</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {isAuth ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={myInfo ? myInfo.user.photo : ""}
                    alt={myInfo ? myInfo.user.name : ""}
                    className="object-cover"
                  />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/login" onClick={handleLogout}>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : currentPath === "/login" ? (
          <Button variant="outline">
            <Link href="/signup">
              <UserPlus />
            </Link>
          </Button>
        ) : currentPath === "/signup" ? (
          <Button variant="outline">
            <Link href="/login">
              <LogIn />
            </Link>
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
