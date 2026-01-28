"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, RocketIcon } from "lucide-react";

interface SidebarProps {
  userRole: string;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarMinimized");
      return savedState === "true";
    }
    return false;
  });
  const pathname = usePathname();

  // Update content margin based on sidebar state
  const updateContentMargin = (minimized: boolean) => {
    const content = document.querySelector(".sidebar-content");
    if (content) {
      (content as HTMLElement).style.marginLeft = minimized ? "4rem" : "16rem";
    }
  };

  // Initialize content margin on mount
  useEffect(() => {
    updateContentMargin(isMinimized);
  }, [isMinimized]);

  // Save sidebar state to localStorage
  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem("sidebarMinimized", String(newState));
    updateContentMargin(newState);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("sidebarToggle"));
  };

  const menuItems = [
    {
      name: "Cohorts",
      href: "/dashboard/cohorts",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Applications",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      roles: ["manager"], // Only managers can see Users
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${
        isMinimized ? "w-16" : "w-64"
      } flex flex-col h-screen fixed left-0 top-0 z-50`}
      style={{ width: isMinimized ? "4rem" : "16rem" }}
    >
      {/* Header */}
      <div
        className={`h-20 border-b border-zinc-200 dark:border-zinc-800 flex items-center ${
          isMinimized ? "justify-center" : "justify-between"
        } px-4`}
      >
        {isMinimized ? (
          <div className="flex items-center justify-center">
            <img
              src="/nirmaan logo.png"
              alt="Nirmaan logo"
              className="w-10 h-10 rounded-lg"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src="/nirmaan logo.png"
              alt="Nirmaan logo"
              className="w-12 h-12 rounded-lg shadow-md"
            />
            <div>
              <h2 className="text-lg font-bold text-black dark:text-zinc-50">
                NIRMAAN
              </h2>
              <p className="text-xs text-primary font-semibold">LaunchPad</p>
            </div>
          </div>
        )}
        <Button
          onClick={toggleMinimize}
          variant="ghost"
          size="icon"
          aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
          className={isMinimized ? "absolute right-2" : ""}
        >
          {isMinimized ? (
            <ArrowRightIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mr-4" />
          ) : (
            <ArrowLeftIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center transition-colors ${
                    isMinimized
                      ? active
                        ? "justify-center w-10 h-10 rounded bg-primary text-white"
                        : "justify-center w-10 h-10 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      : active
                      ? "gap-3 px-3 py-2 rounded-md bg-primary text-white"
                      : "gap-3 px-3 py-2 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  title={isMinimized ? item.name : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${
                      isMinimized && active
                        ? "flex items-center justify-center"
                        : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isMinimized && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          {!isMinimized && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black dark:text-zinc-50 truncate">
                {userRole === "manager" ? "Manager" : "Reviewer"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
