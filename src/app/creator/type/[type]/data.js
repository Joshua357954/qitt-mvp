import { ClipboardList, GraduationCap } from "lucide-react";
import { GrAnnounce } from "react-icons/gr";
import { LuGrid2X2Plus, LuNotebookText } from "react-icons/lu";
import { TbCalendarTime } from "react-icons/tb";

export const DUMMY_DATA = {
  assignments: [
    {
      id: 1,
      title: "Math Homework",
      description: "Complete chapters 5-7 problems",
      dueDate: "2023-12-15",
      createdAt: "2023-11-01",
    },
    {
      id: 2,
      title: "Science Project",
      description: "Research paper on renewable energy",
      dueDate: "2023-12-20",
      createdAt: "2023-11-05",
    },
  ],
  // ... rest of the dummy data
};

export const CONTENT_TYPES = [
    {
      name: "Timetable",
      icon: <TbCalendarTime size={25} className="text-blue-500" />,
      id: "timetable",
    },
    {
      name: "Resource",
      icon: <LuGrid2X2Plus size={25} className="text-yellow-500" />,
      id: "resources",
    },
    {
      name: "Assignment",
      icon: <ClipboardList size={25} className="text-red-500" />,
      id: "assignments",
    },
    
    {
      name: "Courses",
      icon: <GraduationCap size={25} className="text-blue-500" />,
      id: "courses",
    },
    {
      name: "Announcements",
      icon: <GrAnnounce size={25} className="text-green-500" />, // Changed color
      id: "announcements",
    },
  ];