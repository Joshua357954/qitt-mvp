"use client";

import { ArrowLeft, Upload, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Dropdown } from "@/components/Dropdown";
import useTimetableStore from "@/app/store/creator/timetableStore";

export default function CreatorTimetable() {
  const {
    day,
    isLoading,
    setDay,
    timetable,
    addEntry,
    updateEntry,
    removeEntry,
    uploadTimetable,
  } = useTimetableStore();
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  return (
    <main className="min-w-screen font-aeonik">
      {/* Nav 1 */}
      <div className="flex gap-5 items-center p-5 border-b border-gray-500 bg-black">
        <Link href="/creator">
          <ArrowLeft size={20} color={"white"} />
        </Link>
        <p className="text-2xl font-bold text-white">Creator</p>
      </div>

      {/* Main Section */}
      <section className="min-w-screen sm:w-3/4 mx-auto px-2">
        {/* Nav 2 */}
        <nav className="flex sm:justify-between justify-center py-4 items-center border-b border-gray-600">
          <h2 className="text-xl text-center font-semibold">Timetable</h2>
          <button
            onClick={uploadTimetable}
            className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded"
          >
            <Upload size={15} />{" "}
            {isLoading ? "Uploading..." : "Add Timetable"}
          </button>
        </nav>

        {/* Day Selector */}
        <div
          className="w-full overflow-x-auto border rounded-sm border-gray-500 flex h-20
          mb-5 p-2 py-2 sm:p-3"
        >
          {days.map((item) => (
            <div
              key={item}
              onClick={() => setDay(item)}
              className={`capitalize flex flex-1 text-gray-500 select-none justify-center px-4 font-bold text-sm items-center ${
                item === day ? "bg-[#5773FF] text-white" : "bg-blue-5"
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
            className="mx-auto flex items-center gap-2"
          >
            <PlusCircle size={30} /> <span>Add Entry</span>
          </button>
        </div>

        {/* Mobile Upload Button */}
        <button
          onClick={uploadTimetable}
          className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4"
        >
          <Upload size={15} /> {isLoading ? "Uploading..." : "Update Timetable"}
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

      {/* Time Pickers */}
      <div className="flex items-center gap-2">
        {["start", "end"].map((field) => (
          <div key={field} className="flex flex-col items-start">
            <label className="text-sm font-semibold">
              {field === "start" ? "Start" : "End"}
            </label>
            <Flatpickr
              className="border p-1 rounded w-14 text-center"
              value={data[field]}
              onChange={([time]) =>
                updateEntry(
                  data.id,
                  field,
                  time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )
              }
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "h:i K",
                time_24hr: false,
                disableMobile: true,
              }}
            />
          </div>
        ))}
      </div>

      {/* Remove Entry Button */}
      <button onClick={() => removeEntry(data.id)} className="text-red-500">
        <Trash2 size={12} />
      </button>
    </div>
  );
}
