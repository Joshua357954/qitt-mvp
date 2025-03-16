import Image from "next/image";
import Link from "next/link";
import { FaArrowRight as ArrowR } from "react-icons/fa";
import { fbTime, getDay, isDateInPast } from "../utils/utils.js";

function realDate(date) {
  const time = getDay(fbTime(date).getDate());
  //  fbTime(date.dateGiven).getDate()
  const formattedMonth = fbTime(date)?.toLocaleDateString("en-US", {
    month: "long",
  });
  const formattedWeekday = fbTime(date)?.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return `${formattedWeekday} ${formattedMonth} ${time}`;
}

const AssignmentCard = ({ idx, item }) => {
  return (
    <div
      key={idx}
      className="w-full sm:w-[70%] mx-auto mb-2 bg-white min-h-32  flex items-center rounded p-5 border border-gray-400"
    >
      {/* Left Side - Image */}
      <div className="  w-[25%] h-32 bg-[#E2E7FF] flex justify-center items-center rounded-sm">
        <Image
          src={"/hw-book.png"}
          width={10}
          height={10}
          className="w-14"
          alt="Assignment Icon"
          unoptimized
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-[65%] h-full flex flex-col px-3 pt-02 bg-yellow-6000 gap-y-1">
        <h2 className="text-2xl font-extrabold text-gray-700 space-x-5">
          {item?.subject}
        </h2>
        <p className="font-light flex gap-x-2 bg-red-5005 items-start text-left justify-center rounded-xl w-32">
          Assignment{item.numAssignments > 1 ? "s" : ""}{" "}
          <span className=" bg-blue-500 text-white rounded-full px-[6px] text-sm ">
            {item.numAssignments}
          </span>
        </p>

        {/* Assignment Links */}
        <div className="flex gap-1 flex-wrap">
          {item.assignments.map((dateItem, dateIdx) => {
            const formattedDate = realDate(dateItem?.dateGiven)
              .split(" ")
              .slice(-2)
              .join(" ");

            const deadlineDate = realDate(dateItem?.deadline)
              .split(" ")
              .slice(-2)
              .join(" ")
              .split("th")[0];

            return (
              <Link
                key={dateIdx}
                href={`/assignment/details?course=${
                  item?.subject
                }&dateGiven=${realDate(
                  dateItem?.dateGiven
                )}&deadline=${realDate(dateItem?.deadline)}&content=${
                  dateItem?.content
                }`}
                className={`text-gray-700 hover:text-gray-800 text-sm sm:text-md px-2 py-1 gap-x-1 mt-[2px] ${
                  isDateInPast(deadlineDate)
                    ? "bg-red-400 hover:bg-red-500"
                    : "bg-[#E7EBFF] hover:bg-blue-200"
                } text-medium flex items-center rounded`}
              >
                {formattedDate}
                <ArrowR size={9} className="text-gray-700" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
