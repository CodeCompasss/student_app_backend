// "use client"

// import { db } from './db';
// import { events, shouldCleanupEvent } from './db/schema';
// import { and, eq } from 'drizzle-orm';
// import { revalidatePath } from 'next/cache';
// // Run cleanup for expired events
// export async function cleanupExpiredEvents() {
//   try {
//     // Find all active events that haven't been scheduled for cleanup yet
//     const expiredEvents = await db
//       .select()
//       .from(events)
//       .where(
//         and(
//           eq(events.isActive, true),
//           eq(events.cleanupScheduled, false)
//         )
//       );

//     const cleanupPromises = [];

//     for (const event of expiredEvents) {
//       if (shouldCleanupEvent(event.endDate, event.endTime)) {
//         // Mark for cleanup first to prevent duplicate processing
//         await db
//           .update(events)
//           .set({ cleanupScheduled: true })
//           .where(eq(events.id, event.id));

//         // Schedule the actual deletion after a short delay
//         cleanupPromises.push(
//           new Promise(resolve => {
//             setTimeout(async () => {
//               await db.delete(events).where(eq(events.id, event.id));
//               console.log(`Deleted expired event: ${event.id}`);
              
//               // Revalidate any affected pages
//               if (event.slug) {
//                 revalidatePath(`/events/${event.slug}`);
//               }
//               revalidatePath('/events');
              
//               resolve(true);
//             }, 1000); // 1 second delay
//           })
//         );
//       }
//     }

//     await Promise.all(cleanupPromises);
//     return { success: true, count: cleanupPromises.length };
//   } catch (error) {
//     console.error('Error cleaning up expired events:', error);
//     return { success: false, error: 'Failed to clean up expired events' };
//   }
// }

// // Run cleanup every hour
// const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

// let cleanupInterval: NodeJS.Timeout | null = null;

// export function startCleanupScheduler() {
//   if (cleanupInterval) return; // Already running
  
//   // Run immediately on startup
//   cleanupExpiredEvents().catch(console.error);
  
//   // Then run on interval
//   cleanupInterval = setInterval(() => {
//     cleanupExpiredEvents().catch(console.error);
//   }, CLEANUP_INTERVAL);
  
//   console.log('Cleanup scheduler started');
// }

// export function stopCleanupScheduler() {
//   if (cleanupInterval) {
//     clearInterval(cleanupInterval);
//     cleanupInterval = null;
//     console.log('Cleanup scheduler stopped');
//   }
// }

// // Handle process termination
// process.on('SIGTERM', () => {
//   stopCleanupScheduler();
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   stopCleanupScheduler();
//   process.exit(0);
// });
