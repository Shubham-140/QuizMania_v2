"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDialog } from "./useDialog";

const menuItem =
  "flex w-full cursor-pointer items-center px-4 py-3 text-left text-gray-700 transition-all duration-200 hover:translate-x-1 dark:text-gray-300";

const iconProps = {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
};

const ProfileDropdown = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const dropdownRef = useDialog<HTMLDivElement>(onClose, { trapFocus: false });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, onClose]);

  return (
    <div className="fixed inset-0 z-50 mt-2">
      <div className="absolute inset-0" />

      <div
        ref={dropdownRef}
        id="profile-menu"
        aria-label="Account"
        role="region"
        className="absolute top-12 right-4 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-xl shadow-black/10 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95 dark:shadow-black/30"
      >
        <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500" />

        <div className="py-2">
          <Link
            href={`/user/${session?.user?.username}`}
            onClick={onClose}
            className={`${menuItem} hover:bg-slate-50 hover:text-gray-900 dark:hover:bg-slate-800 dark:hover:text-white`}
          >
            <div className="mr-3 flex h-5 w-5 flex-shrink-0">
              <svg {...iconProps}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="text-sm font-medium">Your Profile</span>
          </Link>

          <hr className="my-1 border-slate-200 dark:border-slate-700" />

          <button
            type="button"
            className={`${menuItem} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400`}
            onClick={() => signOut()}
          >
            <div className="mr-3 flex h-5 w-5 flex-shrink-0">
              <svg {...iconProps}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
