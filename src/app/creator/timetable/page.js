"use client";

import {
  ArrowLeft,
  Upload,
  PlusCircle,
  Trash2,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Dropdown } from "@/components/Dropdown";
import useTimetableStore from "@/app/store/creator/timetableStore";
import useDepartmentStore from "@/app/store/departmentStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SelectCourse from "@/components/SelectCourse";
import AddVenue from "./addVenue";
import { Button } from "@/components/ui/button";
import useVenues from "@/hooks/useVenues";

export default function CreatorTimetable() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const {
    day,
    isLoading,
    setDay,
    timetable,
    addEntry,
    updateEntry,
    removeEntry,
    uploadTimetable,
    setTimetable,
  } = useTimetableStore();

  const { getItem } = useDepartmentStore();
  const [venues, setVenues] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (isEditMode && editId) {
        try {
          const fetched = await getItem("timetables", editId);
          if (isMounted && fetched?.timetable) {
            setTimetable(fetched.timetable);
          }
        } catch (error) {
          console.error("Error fetching timetable:", error);
        }
      } else {
        setTimetable([]);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [editId, isEditMode]);

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  const postData = async () => {
    uploadTimetable(editId);
    if (isEditMode) {
      router.back(); // if updating
    } else {
      // If normal posting
    }
  };

  return (
    <main className="min-w-screen font-aeonik">
      {/* Top Navigation */}
      <div className="flex  items-center justify-between p-5 border-b border-gray-500 bg-black">
        <div className="flex gap-5 items-center ">
          <ArrowLeft
            size={20}
            color={"white"}
            onClick={() => window.history.back()}
          />
          <p className="text-2xl font-bold text-white">Timetable</p>
        </div>
        <Button
          className="bg-blue-500 text-white p-3 rounded-lg flex items-center hover:bg-blue-600 transition-all duration-300"
          onClick={() => setVenues(true)}
        >
          <MapPinIcon size={20} color="white" />
          <span>Venues</span>
        </Button>
      </div>

      <section className="min-w-screen sm:w-3/4 mx-auto px-2">
        {/* Sub Navigation */}
        <nav className="flex sm:justify-between justify-center py-4 items-center border-b border-gray-600">
          <h2 className="text-xl text-center font-semibold">
            {" "}
            {isEditMode ? "Edit Timetable" : "Create Timetable"}
          </h2>
          <button
            onClick={postData}
            className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded"
          >
            <Upload size={15} />
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Timetable"
              : "Create Timetable"}
          </button>
        </nav>

        {/* Day Picker */}
        <div className="w-full overflow-x-auto border rounded-sm border-gray-500 flex h-20 mb-5 p-2 py-2 sm:p-3">
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

        {/* Timetable Entries */}
        <div className="flex flex-col gap-5 w-full sm:w-4/5 mx-auto">
          {timetable
            ?.filter((entry) => entry.day === day)
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
            className="mx-auto flex items-center gap-2 text-[#0A32F8]"
          >
            <PlusCircle size={30} /> <span>Add Entry</span>
          </button>
        </div>

        {/* Mobile Upload Button */}
        <button
          onClick={postData}
          className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4"
        >
          <Upload size={15} />
          {isLoading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Timetable"
            : "Create Timetable"}
        </button>
      </section>
      <AddVenue isOpen={venues} onClose={() => setVenues(false)} />
    </main>
  );
}

function CTItem({ data, updateEntry, removeEntry }) {
  function setCourse(value) {
    updateEntry(data.id, "course", value)
  }

  const {venues} = useVenues()

  const dropdownItems = venues ? venues.map(venue => venue.name) : ["Loading"];

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-5 mx-auto items-center border p-2 rounded">
      <p className="font-bold hidden sm:flex">{data.id}</p>
    
      <Dropdown
        label="Venue"
        dropdownItems={dropdownItems}
        value={data.venue}
        onChange={(value) => updateEntry(data.id, "venue", value)}
      />

      <SelectCourse value={data.course} handler={setCourse} />

      <div className="flex items-center gap-2">
        {["start", "end"].map((field) => (
          <div key={field} className="flex flex-col items-start">
            <label className="text-sm font-semibold capitalize">{field}</label>
            <Flatpickr
              className="border p-1 rounded w-16 text-center"
              value={data[field]}
              onChange={([time]) =>
                updateEntry(
                  data.id,
                  field,
                  time?.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
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

      <button
        onClick={() => removeEntry(data.id)}
        className="text-red-500 ml-2"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
