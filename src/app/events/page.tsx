// Admin Events Page - src/app/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
  interface Event {
    id: string;
    title: string;
    venue: string;
    date: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/events").then(res => res.json()).then(setEvents);
  }, []);

  async function deleteEvent(id: string) {
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents(events.filter(e => e.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button
          onClick={() => router.push("/events/new")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>
        
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Venue</th>
            <th className="p-2">Date</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
  {events.map((e: Event) => (
    <tr
      key={e.id}
      className="border-t cursor-pointer hover:bg-gray-50"
      onClick={() => router.push(`/events/${e.id}`)}
    >
      <td className="p-2">{e.title}</td>
      <td className="p-2">{e.venue}</td>
      <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
      <td className="p-2 flex gap-2" onClick={(ev) => ev.stopPropagation()}>
        <button
          onClick={() => router.push(`/events/${e.id}/edit`)}
          className="p-1 bg-yellow-300 rounded"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => deleteEvent(e.id)}
          className="p-1 bg-red-500 text-white rounded"
        >
          <Trash className="w-4 h-4" />
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
