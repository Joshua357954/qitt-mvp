import Image from "next/image";
import Link from "next/link";
import { FaArrowRight as ArrowR } from "react-icons/fa";

const AssignmentCard = ({ idx, item, courseCategory }) => {
  return (
    <div
      key={idx}
      className="w-full sm:w-[70%] mx-auto mb-2 bg-white min-h-32 flex items-center rounded p-5 border border-gray-400"
    >
      {/* Left Side - Image  */}
      <div className="w-[25%] h-32 bg-[#E2E7FF] flex justify-center items-center rounded-sm">
        <Image
          src={"/hw-book.png"}
          width={40}
          height={40}
          className="w-14"
          alt="Assignment Icon"
          unoptimized
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-[65%] h-full flex flex-col px-3 pt-02 bg-yellow-6000 gap-y-1">
        <h2 className="text-2xl font-extrabold text-gray-700 space-x-5">
          {courseCategory}
        </h2>
        <p className="font-light flex gap-x-2 bg-red-5005 items-start text-left justify-center rounded-xl w-32">
          Assignment{item?.length > 1 ? "s" : ""}{" "}
          <span className="bg-blue-500 text-white rounded-full px-[6px] text-sm">
            {item?.length}
          </span>
        </p>
{/* {JSON.stringify(item)} */}
        {/* Assignment Links */}
        <div className="flex gap-1 flex-wrap">
          {Array.isArray(item) &&
            item.map((miniItem, id) => {
              const dateGiven = miniItem?.dateGiven;
              const deadline = miniItem?.dueDate;

              // Assuming dateItem is miniItem here and formatted
              const formattedDeadline = deadline
                ? new Date(deadline).toLocaleDateString()
                : "";

              return (
                <Link
                  key={id}
                  href={`/assignment/details?id=${miniItem.id}`}
                  className={`text-gray-700 hover:text-gray-800 text-sm sm:text-md px-2 py-1 gap-x-1 mt-[2px] ${
                    isDateInPast(formattedDeadline)
                      ? "bg-red-400 hover:bg-red-500"
                      : "bg-[#E7EBFF] hover:bg-blue-200"
                  } text-medium flex items-center rounded`}
                >
                  {dateGiven}
                  <ArrowR size={9} className="text-gray-700" />
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Helper function to check if date is in the past
const isDateInPast = (date) => {
  const today = new Date();
  return new Date(date) < today;
};

export default AssignmentCard;
