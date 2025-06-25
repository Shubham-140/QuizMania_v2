"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ProfileDropdown = () => {
  const { data: session } = useSession();
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
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
      {/* Transparent overlay that does not block interaction */}
      <div className="absolute inset-0" />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute top-12 right-4 w-48 rounded-xl border backdrop-blur-sm overflow-hidden shadow-xl mt-1 ${
          lightMode
            ? "bg-white/95 border-slate-200 shadow-black/10"
            : "bg-slate-900/95 border-slate-600 shadow-black/30"
        }`}
      >
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500"></div>

        <div className="py-2">
          {/* Your Profile */}
          <div
            className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 hover:translate-x-1 ${
              lightMode
                ? "hover:bg-slate-50 text-gray-700 hover:text-gray-900"
                : "hover:bg-slate-800 text-gray-300 hover:text-white"
            }`}
            onClick={() => {
              const username = session?.user?.username;
              router.push(username ? `/user/${username}` : "/profile");
            }}
          >
            <div className="w-5 h-5 mr-3 flex-shrink-0">
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
            <span className="font-medium text-sm">Your Profile</span>
          </div>

          <hr
            className={`my-1 ${
              lightMode ? "border-slate-200" : "border-slate-700"
            }`}
          />

          {/* Logout */}
          <div
            className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 hover:translate-x-1 ${
              lightMode
                ? "hover:bg-red-50 text-gray-700 hover:text-red-600"
                : "hover:bg-red-900/20 text-gray-300 hover:text-red-400"
            }`}
            onClick={() => signOut()}
          >
            <div className="w-5 h-5 mr-3 flex-shrink-0">
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
            <span className="font-medium text-sm">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
