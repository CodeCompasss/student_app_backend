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
    date: new Date(),
    time: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setSaving(true);

  const formattedDate = form.date?.toISOString().split("T")[0] ?? "";

  const data = new FormData();

  // append normal fields safely
  data.append("title", form.title ?? "");
  data.append("description", form.description ?? "");
  data.append("venue", form.venue ?? "");
  data.append("date", formattedDate);
  data.append("time", form.time ?? "");

  // append file only if selected
  if (imageFile) {
    data.append("image", imageFile);
  }

  await fetch("/api/events", {
    method: "POST",
    body: data,
  });

  setSaving(false);
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

      {/* Image (optional) */}
      <div>
        <label className="block mb-1 font-medium">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
