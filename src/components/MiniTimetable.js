import { useEffect, useState } from "react";
import { formatCode } from "../utils/utils.js";
import useDepartmentStore from "@/app/store/departmentStore.js";

const currentDateTime = new Date();
const currentTime =
  currentDateTime.getHours() * 100 + currentDateTime.getMinutes();
const currentDay ='friday' ||currentDateTime
  .toLocaleString("en-US", { weekday: "long" })
  .toLowerCase();

const TimetableList = () => {
  const { timetables, fetchTimetable } = useDepartmentStore();
  const [loading, setLoading] = useState(true);
  const [todayTimetables, setTodayTimetables] = useState([]);

  // Fetch timetable data and filter for today
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📡 Fetching timetable data...");
        setLoading(true);
        
        fetchTimetable();
        
        console.log("✅ Timetable data fetched: ", timetables);

        if (timetables.length > 0 && timetables[0]?.timetable) {
          const filteredData = timetables[0].timetable.filter(
            (item) => item.day.toLowerCase() === currentDay
          );
          setLoading(false);
          console.log("🎯 Filtered data for today: ", filteredData);
          setTodayTimetables(filteredData);
        } else {
          console.warn("⚠️ No timetable data found.");
        }
      } catch (error) {
        console.error("❌ Error fetching timetable: ", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [fetchTimetable, timetables.length]);

  // Function to parse 12-hour format to 24-hour
  const parseTime = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 100 + minutes;
  };

  // Loader Component
  const Loader = () => (
    <>
      <div className="flex gap-4">
        <div className="w-36 h-5 bg-gray-200 rounded-md"></div>
        <div className="w-5 h-5 rounded-full bg-gray-200"></div>
      </div>
      <div className="flex gap-2 mt-3 mb-4 overflow-x-auto">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex w-fit px-4 py-6 items-center rounded-md border-2 border-gray-300 animate-pulse"
          >
            <div className="w-16 h-5 bg-gray-200 rounded-md"></div>
            <div className="w-1 mx-2 h-[90%] bg-gray-300"></div>
            <div>
              <div className="w-24 h-5 bg-gray-200 mb-2 rounded-md"></div>
              <div className="w-32 h-5 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (loading) {
    return <Loader />;
  }

  if (todayTimetables.length === 0) {
    console.log("🛑 No classes scheduled for today.");
    return <p className="text-gray-500">No classes scheduled for today.</p>;
  }

  return (
    <>
      <h2 className="font-semibold text-xl mt-8 mb-1">
        Today's Classes
        {todayTimetables.length > 0 && (
          <span className="bg-blue-500 text-sm text-white rounded-full ml-3 px-2 py-1">
            {todayTimetables.length}
          </span>
        )}
      </h2>

      <div className="flex gap-2 mt-3 mb-4 overflow-x-auto">
        {todayTimetables.map((item, index) => {
          const timetableStartTime = parseTime(item.start);
          const isTimePassed = currentTime > timetableStartTime;

          return (
            <div
              className={`flex w-fit px-4 py-6 items-center rounded-md border-2 ${
                isTimePassed ? "border-red-300" : "border-gray-300"
              }`}
              key={index}
            >
              <p style={{ whiteSpace: "nowrap" }}>
                {`${item.start} - ${item.end}`}
              </p>
              <div className="w-1 mx-2 h-[90%] bg-red-500"></div>
              <div>
                <p className="font-bold" style={{ whiteSpace: "nowrap" }}>
                  {formatCode(item.course)}
                </p>
                <p style={{ whiteSpace: "nowrap" }}>{item.venue}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TimetableList;
