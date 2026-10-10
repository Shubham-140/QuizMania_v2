"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ProfileDropdown = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 mt-2">
      <div className="absolute inset-0" />

      <div
        ref={dropdownRef}
        className="absolute top-12 right-4 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-xl shadow-black/10 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95 dark:shadow-black/30"
      >
        <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500" />

        <div className="py-2">
          <div
            className="flex cursor-pointer items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:translate-x-1 hover:bg-slate-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => {
              const username = session?.user?.username;
              router.push(`/user/${username}`);
            }}
          >
            <div className="mr-3 flex h-5 w-5 flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="text-sm font-medium">Your Profile</span>
          </div>

          <hr className="my-1 border-slate-200 dark:border-slate-700" />

          <div
            className="flex cursor-pointer items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:translate-x-1 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            onClick={() => signOut()}
          >
            <div className="mr-3 flex h-5 w-5 flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
