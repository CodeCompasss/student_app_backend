'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface EventListProps {
  events: Event[];
  isAdmin?: boolean;
}

export function EventList({ events, isAdmin = false }: EventListProps) {
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Sort events by date (newest first)
    const sorted = [...events].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setSortedEvents(sorted);
  }, [events]);

  const renderEventItem = (event: Event) => (
    <div key={event.id} className="mb-4 p-2 border-b border-gray-200">
      <Link href={`/events/${event.slug}`} className="block hover:bg-gray-50 p-2 rounded">
        <h3 className="font-medium text-gray-900">{event.title}</h3>
        {event.date && (
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
            {event.time && ` • ${event.time}`}
          </p>
        )}
        {event.venue && <p className="text-xs text-gray-400">{event.venue}</p>}
      </Link>
      {isAdmin && (
        <div className="mt-2 flex space-x-2">
          <Link 
            href={`/events/${event.slug}/edit`}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Edit
          </Link>
          <button 
            onClick={() => {}}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {sortedEvents.length > 0 ? (
        <div className="space-y-2">
          {sortedEvents.slice(0, 5).map(renderEventItem)}
        </div>
      ) : (
        <p className="text-sm text-gray-500 p-2">No events found.</p>
      )}
      
      {isAdmin && (
        <div className="pt-4 border-t border-gray-200">
          <Link 
            href="/events/new"
            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Event
          </Link>
        </div>
      )}
    </div>
  );
}
