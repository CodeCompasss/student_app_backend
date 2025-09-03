"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";

import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: new Date(), // only date
    time: "", // only time (string HH:mm)
    image: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formattedDate = form.date.toISOString().split("T")[0]; // YYYY-MM-DD

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        venue: form.venue,
        date: formattedDate, // goes to timestamp("date")
        time: form.time, // goes to varchar("time")
        image: form.image,
      }),
    });

    router.push("/events");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add New Event</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Venue"
        value={form.venue}
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
        required
      />

      {/* Date Picker */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <DatePicker
          selected={form.date}
          onChange={(date) => date && setForm({ ...form, date })}
          dateFormat="yyyy-MM-dd"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Time Picker */}
      <div>
        <label className="block mb-1 font-medium">Time</label>
        <TimePicker
          onChange={(value) => setForm({ ...form, time: value || "" })}
          value={form.time}
          disableClock={true}
          format="HH:mm"
          className="w-full border p-2 rounded"
        />
      </div>

      <input
        className="w-full border p-2 rounded"
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
        required
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Save
      </button>
    </form>
  );
}
