'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EventList } from './EventList';

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  venue: string | null;
  date: Date | null;
  time: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SidebarProps {
  events: Event[];
  isAdmin?: boolean;
}

export function Sidebar({ events, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 h-full flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Event Manager</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/') 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="truncate">Home</span>
          </Link>
          
        
          
          <Link
            href="/events/past"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive('/events/past')
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="truncate">Past Events</span>
          </Link>
        </div>
        
        {/* <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Quick Access
          </h3>
          <EventList events={events.slice(0, 3)} isAdmin={isAdmin} />
        </div> */}
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {isAdmin ? 'Admin' : 'Guest'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
