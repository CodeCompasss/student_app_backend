import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, gte } from 'drizzle-orm';
import { format } from 'date-fns';

export default async function PresentEventsPage() {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  const presentEvents = await db
    .select()
    .from(events)
    .where(gte(events.endDate, currentDate))
    .orderBy(events.startDate);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Present Events</h1>
      {presentEvents.length === 0 ? (
        <p className="text-gray-500">No current events found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presentEvents.map((event) => (
            <div key={event.id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-medium">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(event.startDate), 'MMM d, yyyy')} - {format(new Date(event.endDate), 'MMM d, yyyy')}
              </p>
              <p className="mt-2 text-sm text-gray-700">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
