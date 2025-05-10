"use client";
import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout.jsx";
import { FaChevronRight as ArrowRight, FaChevronLeft as ArrowLeft } from "react-icons/fa";
import Image from "next/image";
import useDepartmentStore from "../store/departmentStore.js";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const TimetableScreen = ({ className }) => {
  const currentDay = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedTimetables, setGroupedTimetables] = useState({});
  const { timetables, fetchTimetable } = useDepartmentStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("📡 Fetching timetable data...");
        await fetchTimetable();
        
        if (timetables.length > 0 && timetables[0]?.timetable) {
          console.log("✅ Timetable data fetched successfully.");
          const structuredTimetables = daysOfWeek.reduce((accumulator, day) => {
            accumulator[day] = timetables[0].timetable.filter(
              (entry) => entry.day.toLowerCase() === day
            );
            return accumulator;
          }, {});

          setGroupedTimetables(structuredTimetables); // State update
        } else {
          console.warn("⚠️ No timetable data found.");
        }
      } catch (error) {
        console.error("❌ Error fetching timetable data: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchTimetable, timetables.length]);

  const SkeletonLoader = () => (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="p-4 border rounded-sm border-gray-300 flex flex-col gap-2"
          >
            <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
            <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
            <div className="w-full h-2 bg-gray-300 rounded"></div>
          </div>
        ))}
    </div>
  );

  return (
    <MainLayout route="Timetable">
      <div className="w-full h-[96%] flex flex-col justify-center">
        <div className="w-full flex flex-col items-center pt-5 px-6">
          <div className="w-full border rounded-sm border-gray-500 flex justify-between overflow-x-auto h-20 gap-2 mb-5 p-2 py-3">
            {daysOfWeek.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`capitalize flex justify-center px-4 font-bold text-sm items-center ${
                  day === selectedDay
                    ? "bg-[#5773FF] text-white"
                    : "bg-gray-200 text-gray-500"
                } rounded cursor-pointer transition duration-300`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="px-2 flex flex-wrap justify-center gap-5 items-center w-full">
            {isLoading ? (
              <SkeletonLoader />
            ) : groupedTimetables[selectedDay] &&
              groupedTimetables[selectedDay].length > 0 ? (
              groupedTimetables[selectedDay].map((classInfo, index) => (
                <div
                  className="p-4 border items-center rounded-sm sm:min-w-40 min-w-36 border-gray-300 flex flex-col gap-1 transition hover:shadow-lg"
                  key={index}
                >
                  <Image
                    src="/t-book.png"
                    alt="book-icon"
                    width={25}
                    height={25}
                    unoptimized
                  />
                  <p className="font-bold">{classInfo.course}</p>
                  <p className="text-[#5773FF] text-sm font-semibold">
                    {classInfo.start} - {classInfo.end}
                  </p>
                  <p>{classInfo.venue}</p>
                </div>
              ))
            ) : (
              <div className="w-full text-center mt-4 text-gray-600">
                📅 No classes scheduled for {selectedDay}.<br />
                <a
                  href="https://api.whatsapp.com/send?phone=+2349034954069&text=Hi,%20please,%20I%20want%20to%20add/update%20my%20timetable."
                  target="_blank"
                  className="text-blue-500"
                >
                  Click here for a quick chat
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimetableScreen;
