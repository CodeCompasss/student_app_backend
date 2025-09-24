import { notFound } from "next/navigation";
import Image from "next/image";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const event = await res.json();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <span>{event.venue}</span>
          <span>•</span>
          <span>
            {new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span>{event.time}</span>
        </div>
      </div>

      {event.imageData && (
        <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={event.imageData}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {event.description && (
        <div className="prose max-w-none mt-8">
          <p className="whitespace-pre-line text-gray-700">{event.description}</p>
        </div>
      )}
    </div>
  );
}

