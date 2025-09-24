// components/AuthWrapper.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";
import Sidebar from "./Sidebar";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { firestore } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (!user?.email) {
        router.push("/login");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(firestore, "adminemail", user.email);
        const userDoc = await getDoc(userDocRef);
        const role = userDoc.exists() ? userDoc.data()?.role : null;

        if (role === "admin" || role === "superadmin") {
          setUserRole(role);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} userRole={userRole} />
      
      <div className="flex-1 flex flex-col lg:ml-48 transition-all duration-300 min-w-0">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
