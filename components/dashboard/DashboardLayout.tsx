"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    role: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  useEffect(() => {
    checkUser();
    // Load sidebar state
    const savedState = localStorage.getItem("sidebarMinimized");
    if (savedState !== null) {
      setSidebarMinimized(savedState === "true");
    }

    // Listen for sidebar state changes
    const handleStorageChange = () => {
      const savedState = localStorage.getItem("sidebarMinimized");
      if (savedState !== null) {
        setSidebarMinimized(savedState === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen to custom event for same-tab updates
    window.addEventListener("sidebarToggle", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sidebarToggle", handleStorageChange);
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || (profile.role !== "manager" && profile.role !== "reviewer")) {
        router.push("/login");
        return;
      }

      setUser({ ...user, role: profile.role });
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
      <Sidebar userRole={user.role} />
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300 sidebar-content">
        {/* Top Navigation Bar */}
        <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center justify-between px-6">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email} ({user.role})
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
