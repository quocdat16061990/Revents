"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, History, UserCog } from "lucide-react";
import Link from "next/link";


interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function UserProfile({ showDetails = true }: { showDetails?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        console.log("Session data:", data); // Debug log
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // Clear user state immediately for better UX
      setUser(null);

      // Call signOut action
      await signOutUser();

      // Force refresh to clear all session data
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, redirect to home
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {showDetails && (
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.role && (
              <p className="text-xs leading-none text-blue-600 font-medium">
                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link className='w-full flex items-center' href='/user/profile'>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className='w-full flex items-center' href='/user/orders'>
            <History className=" h-4 w-4" />
            <span>Order History</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className=" h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {
          user.role === 'ADMIN' && (
            <DropdownMenuItem>
              <Link className='w-full flex items-center' href='/admin/overview'>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
          )
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoggingOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  );
}
