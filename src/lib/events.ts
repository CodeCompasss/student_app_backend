import { InferSelectModel } from 'drizzle-orm';
import { events } from './db/schema';

type Event = InferSelectModel<typeof events>;

export function categorizeEvents(events: Event[]) {
  const now = new Date();
  
  return events.reduce((acc, event) => {
    if (!event.date) {
      return acc; // Skip events without a date
    }
    
    const eventDate = new Date(event.date);
    
    if (eventDate > now) {
      acc.upcoming.push(event);
    } else if (eventDate < now) {
      acc.past.push(event);
    } else {
      acc.current.push(event);
    }
    
    return acc;
  }, { current: [] as Event[], upcoming: [] as Event[], past: [] as Event[] });
}

export function formatEventDate(date: Date | string | null) {
  if (!date) return 'Date not set';
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatEventTime(time: string | null) {
  if (!time) return '';
  return time; // Return as-is, or format if needed
}
