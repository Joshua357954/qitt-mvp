"use client";

import { ArrowLeft, Upload, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "@/components/Dropdown"; // Assuming you have a Dropdown component

export default function CreatorTimetable() {
  const [day, setDay] = useState("friday");
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  // Single array storing all timetable entries with associated days
  const [timetable, setTimetable] = useState([]);

  // Function to add a new entry
  const addEntry = () => {
    setTimetable((prev) => [
      ...prev,
      { id: Date.now(), day, venue: "", course: "", start: "", end: "" },
    ]);
  };

  // Function to update an entry
  const updateEntry = (id, field, value) => {
    setTimetable((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Function to remove an entry
  const removeEntry = (id) => {
    setTimetable((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <main className="w-screen font-aeonik">
      {/* Nav 1 */}
      <div className="flex gap-5 items-center p-5 border-b border-gray-500">
        <Link href="/creator">
          <ArrowLeft size={20} />
        </Link>
        <p className="text-2xl font-bold">Creator</p>
      </div>

      {/* Main Section */}
      <section className="w-full sm:w-3/4 mx-auto px-2">
        {/* Nav 2 */}
        <nav className="flex sm:justify-between justify-center py-4 items-center border-b border-gray-600">
          <h2 className="text-xl text-center font-semibold ">Timetable</h2>
          <button className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded">
            <Upload size={15} /> Update Timetable
          </button>
        </nav>

        {/* Day Selector */}
        <div className="w-full justify-between sm:justify-center border rounded-sm border-gray-500 flex overflow-x-auto h-20 sm:gap-20   mb-5 p-2 py-2 sm:p-3">
          {days.map((item) => (
            <div
              key={item}
              onClick={() => setDay(item)}
              className={`capitalize flex text-gray-500 select-none justify-center px-4 font-bold text-sm items-center ${
                item === day
                  ? "bg-[#5773FF] text-white border-[0px] border-black"
                  : "bg-blue-5"
              } rounded`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Filtered Entries for Selected Day */}
        <div className="flex flex-col gap-5 w-full sm:w-4/5 mx-auto">
          {timetable
            .filter((entry) => entry.day === day)
            .map((entry) => (
              <CTItem
                key={entry.id}
                data={entry}
                updateEntry={updateEntry}
                removeEntry={removeEntry}
              />
            ))}
          <button
            onClick={addEntry}
            title="Add New Entry"
            className="mx-auto flex items-center gap-2"
          >
            <PlusCircle size={30} /> <span>Add Entry</span>
          </button>

        </div>
        <button className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-4/5 mx-auto my-4 ">
          <Upload size={15} /> Update Timetable
        </button>
      </section>
    </main>
  );
}

function CTItem({ data, updateEntry, removeEntry }) {
  return (
    <div className="flex gap-3 sm:gap-5 mx-auto items-center border p-2 rounded">
      <p className="font-bold hidden sm:flex">{data.id}</p>

      {/* Venue Dropdown */}
      <Dropdown
        label="Venue"
        dropdownItems={["Mba 1", "Ps Hall", "College Hall"]}
        value={data.venue}
        onChange={(value) => updateEntry(data.id, "venue", value)}
      />

      {/* Course Dropdown */}
      <Dropdown
        label="Course"
        dropdownItems={["Math 101", "Physics 202", "CS 303"]}
        value={data.course}
        onChange={(value) => updateEntry(data.id, "course", value)}
      />

      {/* Start Time Picker */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold">Start Time</label>
        <input
          type="time"
          value={data.start}
          onChange={(e) => updateEntry(data.id, "start", e.target.value)}
          placeholder="00:00"
          className="border p-1 rounded w-24"
        />
      </div>

      <p className="font-bold text-xl">-</p>

      {/* End Time Picker */}
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold">End Time</label>
        <input
          type="time"
          value={data.end}
          onChange={(e) => updateEntry(data.id, "end", e.target.value)}
          placeholder="00:00"
          className="border p-1 rounded w-24"
        />
      </div>

      {/* Remove Entry Button */}
      <button onClick={() => removeEntry(data.id)} className="text-red-500">
        <Trash2 size={20} />
      </button>
    </div>
  );
}
