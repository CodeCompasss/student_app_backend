import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const event = await res.json();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.venue}</p>
      <p className="text-gray-500">
        {new Date(event.date).toLocaleDateString()} at {event.time}
      </p>
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full rounded-lg shadow"
        />
      )}
      <p className="mt-4 whitespace-pre-line">{event.description}</p>
    </div>
  );
}

