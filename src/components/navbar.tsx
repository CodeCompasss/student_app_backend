"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOutWithGoogle } from "@/lib/firebase/auth";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutWithGoogle();
      setUser(null);
      router.push("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
          
          <Link href="/" className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </h1>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                    {user?.displayName || user?.email?.split('@')[0] || "User"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <Link href="/login">
              <button className="px-5 py-2 rounded-full bg-black text-white font-medium text-sm hover:bg-gray-800 transition shadow-md hover:shadow-lg">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
