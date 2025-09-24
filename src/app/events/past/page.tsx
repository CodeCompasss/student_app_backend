import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { lt } from 'drizzle-orm';
import { format } from 'date-fns';

export default async function PastEventsPage() {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  const pastEvents = await db
    .select()
    .from(events)
    .where(lt(events.endDate, currentDate))
    .orderBy(events.endDate);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Past Events</h1>
      {pastEvents.length === 0 ? (
        <p className="text-gray-500">No past events found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
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
