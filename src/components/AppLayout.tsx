'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EventList } from './EventList';
import { events } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

type Event = InferSelectModel<typeof events>;

interface AppLayoutProps {
  children: React.ReactNode;
  events: Event[];
  isAdmin?: boolean;
}

export function AppLayout({ children, events, isAdmin = false }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on auth pages
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Event Manager
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto px-4 py-2">
            <div className="space-y-1">
              <Link
                href="/"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="truncate">Home</span>
              </Link>
              
              <Link
                href="/events/present"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/events/present'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="truncate">Present Events</span>
              </Link>
              
              <Link
                href="/events/past"
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === '/events/past'
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="truncate">Past Events</span>
              </Link>
            </div>
            
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                All Events
              </h3>
              <div className="mt-1">
                <EventList events={events} isAdmin={isAdmin} />
              </div>
            </div>
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {isAdmin ? 'Admin User' : 'Guest User'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {isAdmin ? 'Administrator' : 'Viewer'}
                </p>
              </div>
              {isAdmin && (
                <Link 
                  href="/admin/settings" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Settings
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 lg:pl-4">
            <h1 className="text-lg font-medium text-gray-900">
              {pathname === '/' ? 'Dashboard' : (pathname.split('/').pop() || '').charAt(0).toUpperCase() + (pathname.split('/').pop() || '').slice(1)}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href={isAdmin ? '/admin' : '/login'}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {isAdmin ? 'Admin Panel' : 'Login'}
            </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
