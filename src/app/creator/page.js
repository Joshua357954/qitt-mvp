import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Megaphone,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { GraduationCap } from "lucide-react";
import { TbCalendarTime } from "react-icons/tb";
import { LuNotebookText } from "react-icons/lu";
import { LuGrid2X2Plus } from "react-icons/lu";
import { GrAnnounce } from "react-icons/gr";
import { AiOutlineNotification } from "react-icons/ai";

const components = [
  {
    name: "Timetable",
    icon: <TbCalendarTime size={25} className="text-blue-500" />,
    path: "timetable",
  },
  {
    name: "Resource",
    icon: <LuGrid2X2Plus size={25} className="text-yellow-500" />,
    path: "resources",
  },
  {
    name: "Assignment",
    icon: <ClipboardList size={25} className="text-red-500" />,
    path: "assignment",
  },
  {
    name: "Notes",
    icon: <LuNotebookText size={25} className="text-purple-500" />,
    path: "note",
  },
  {
    name: "Courses",
    icon: <GraduationCap size={25} className="text-blue-500" />,
    path: "type/courses/",
  },
  {
    name: "Announcements",
    icon: <GrAnnounce size={25} className="text-green-500" />, // Changed color
    path: "announcement",
  },
];

export default function CreatorHome() {
  const screenName = "yourScreenName"; // Replace with dynamic value

  return (
    <main className="w-full font-aeonik min-h-screen bg-red-6000">
      {/* Nav */}
      <div
        className="flex gap-5 items-center 
      h-20 border-b border-gray-300 px-6"
      >
        <Link href="/">
          <ArrowLeft size={20} />
        </Link>
        <p className="text-2xl font-bold">Creator</p>
      </div>

      {/* Main Content */}
      <section className="w-full px-8 sm:px-0 sm:w-1/3 mx-auto py-5 flex flex-col gap-6 h-full">
        <div className="mt-2">
          <h1 className="font-bold text-2xl">Welcome Back.</h1>
          <div className="bg-blue-700 rounded-md h-24 mt-4 w-full"></div>
        </div>

        <div className="mt-5">
          <h2 className="font-semibold">Add Content</h2>
          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {components.map((component) => (
              <Link
                key={component.name}
                href={`/creator/${component.path}`}
                className="p-3 rounded-md bg-gray-100 h-[5.4rem] flex flex-col items-center justify-center hover:bg-gray-200 transition"
              >
                {component.icon}
                <p className="font-semibold mt-2">{component.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
