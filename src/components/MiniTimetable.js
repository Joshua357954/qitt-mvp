import {
  baseUrl,
  formatCode,
  formatTime,
  formatTimetableEntry,
  getCurrentDay,
} from "../utils/utils.js";
import { MdOutlineLocationOn as Location } from "react-icons/md";
import { RiTimerFlashLine as Timer } from "react-icons/ri";

const TimetableList = ({ timetable, timetableData, currentTime }) => {
  if (!timetable || timetableData(timetable)?.length === 0) return null;

  return (
    <div className="flex gap-2 mt-3 mb-4 overflow-x-auto">
      {timetableData(timetable).map((item, index) => {
        const timetableStartTime = parseInt(
          item.time.split("-")[0].replace(":", "")
        );
        const isCurrentTimeAround =
          Math.abs(currentTime - timetableStartTime) < 100;
        const isTimePassed = currentTime > timetableStartTime;

        return (
          <div
            className="flex w-fit p-4 items-center rounded-md border-2 border-gray-300"
            key={index}
          >
            <p style={{ whiteSpace: "nowrap" }}>{formatTime(item.time)}</p>
            <div className="w-1 mx-2 h-[90%] bg-red-500"></div>
            <div>
              <p className="font-bold" style={{ whiteSpace: "nowrap" }}>
                {formatCode(item.course)}
              </p>
              <p style={{ whiteSpace: "nowrap" }}> {item.venue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimetableList;

{
  /* <div
            key={index}
            className={`flex border-l-2 border-l-gray-400 flex-col gap-0 bg-gray-50 px-2 py-1 rounded border-2 border-gray-50 ${
              isTimePassed ? "time-passed" : ""
            }`}
          >
            <p
              className="font-bold pl-[.1rem] flex justify-between"
              style={{ whiteSpace: "nowrap" }}
            >
              {formatCode(item.course)}{" "}
              <span>
                {isTimePassed ? "✅" : isCurrentTimeAround ? "🔥" : "⌛"}
              </span>
            </p>
            <div className="flex items-center">
              <Timer className="text-md text-[#FFDAB9]" />
              <p className="font-normal ml-2" style={{ whiteSpace: "nowrap" }}>
                {formatTime(item.time)}
              </p>
            </div>
            <div className="flex items-center">
              <Location className="text-lg text-[#8FBC8F]" />
              <p className="ml-2" style={{ whiteSpace: "nowrap" }}>
                {item.venue}
              </p>
            </div>
          </div>
        );
      })}
    </div> */
}
