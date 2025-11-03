"use client";

import { useState, useEffect } from "react";
import Menu from './menu';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function AuthSection() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/session");
      if (response.ok) {
        const data = await response.json();
        // Kiểm tra data và data.user trước khi set
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for storage events to update when user logs out
  useEffect(() => {
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return <Menu user={user}/>;
}
