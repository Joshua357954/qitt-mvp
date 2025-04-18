"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CalendarDays,
  FileText,
  BookOpen,
  Megaphone,
  ExternalLink,
  Notebook,
  Clock,
  Pencil,
  Trash2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Dummy data for all content types
const DUMMY_DATA = {
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
  announcements: [
    {
      id: 1,
      title: "Campus Closure",
      content: "University will be closed next Monday for maintenance",
      createdAt: "2023-11-10",
    },
  ],
  courses: [
    {
      id: 1,
      courseCode: "CS101",
      title: "Introduction to Computer Science",
      description: "Fundamentals of programming and algorithms",
      instructor: "Dr. Smith",
      credits: 3,
      createdAt: "2023-08-15",
    },
  ],
  resources: [
    {
      id: 1,
      title: "React Documentation",
      description: "Official React documentation for hooks",
      url: "https://react.dev",
      createdAt: "2023-11-12",
    },
  ],
  notes: [
    {
      id: 1,
      title: "Lecture Notes Week 5",
      content: "Important concepts about state management",
      tags: ["react", "state"],
      updatedAt: "2023-11-08",
    },
  ],
  timetable: [
    {
      id: 1,
      courseCode: "CS101",
      title: "Midterm Exam",
      date: "2023-12-10",
      time: "09:00 AM",
      location: "Building A, Room 203",
      type: "exam",
      instructor: "Dr. Smith",
      updatedAt: "2023-11-01",
    },
  ],
};

const CONTENT_TYPES = [
  {
    id: "assignments",
    name: "Assignments",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "announcements",
    name: "Announcements",
    icon: <Megaphone className="h-4 w-4" />,
  },
  { id: "courses", name: "Courses", icon: <BookOpen className="h-4 w-4" /> },
  {
    id: "resources",
    name: "Resources",
    icon: <ExternalLink className="h-4 w-4" />,
  },
  { id: "notes", name: "Notes", icon: <Notebook className="h-4 w-4" /> },
  { id: "timetable", name: "Timetable", icon: <Clock className="h-4 w-4" /> },
];

export default function SpacePage() {
  const [activeType, setActiveType] = useState("assignments");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load dummy data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItems(DUMMY_DATA[activeType] || []);
      setIsLoading(false);
    }, 500);
  }, [activeType]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const renderItemActions = (type, id) => (
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${type}/edit/${id}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(id)}>
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No {activeType} found</p>
          </CardContent>
        </Card>
      );
    }

    return items.map((item) => {
      switch (activeType) {
        case "assignments":
          return (
            <Card key={item.id} className="mb-4 border-l-4 border-blue-500">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {item.title}
                  </CardTitle>
                  {renderItemActions("assignments", item.id)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center gap-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md w-fit">
                  <AlertCircle className="h-4 w-4" />
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                Posted: {new Date(item.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          );

        case "announcements":
          return (
            <Card key={item.id} className="mb-4 border-l-4 border-orange-500">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-orange-600" />
                    {item.title}
                  </CardTitle>
                  {renderItemActions("announcements", item.id)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{item.content}</p>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                Posted: {new Date(item.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          );

        case "courses":
          return (
            <Card key={item.id} className="mb-4 border-l-4 border-green-500">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    {item.courseCode}: {item.title}
                  </CardTitle>
                  {renderItemActions("courses", item.id)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Instructor: {item.instructor}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Credits: {item.credits}
                  </span>
                </div>
              </CardContent>
            </Card>
          );

        case "resources":
          return (
            <Card key={item.id} className="mb-4 border-l-4 border-purple-500">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-purple-600" />
                    {item.title}
                  </CardTitle>
                  {renderItemActions("resources", item.id)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resource
                  </a>
                </Button>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                Posted: {new Date(item.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          );

        case "notes":
          return (
            <Card key={item.id} className="mb-4 border-l-4 border-amber-500">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Notebook className="h-5 w-5 text-amber-600" />
                    {item.title}
                  </CardTitle>
                  {renderItemActions("notes", item.id)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {item.content}
                </p>
                {item.tags && (
                  <div className="flex gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                Last updated: {new Date(item.updatedAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          );

        case "timetable":
          return (
            <Card key={item.id} className="mb-4 border-l-4 border-red-500">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    {item.courseCode} - {item.title}
                  </CardTitle>
                  {renderItemActions("timetable", item.id)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p>
                      {new Date(item.date).toLocaleDateString()} {item.time}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{item.location}</p>
                  </div>
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="capitalize">{item.type}</p>
                  </div>
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p>{item.instructor}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-500">
                <CalendarDays className="h-4 w-4 mr-1" />
                Updated: {new Date(item.updatedAt).toLocaleDateString()}
              </CardFooter>
              - Normal Timetable
              - Exam Timetable
              - Today's Timetable
            </Card>
          );

        default:
          return null;
      }
    });
  };

  return (
    <main className="w-full font-aeonik">
      {/* Nav 1 */}
      <div className="flex gap-5 items-center p-5 border-b border-gray-500 bg-black">
        <Link href="/creator">
          <ArrowLeft size={20} color={"white"} />
        </Link>
        <p className=" text-2xl font-bold text-white">Creator</p>
        {/* <p className="text-blue-400 bg-blue-400  py-3 bg-opacity-30 font-semibold rounded-full px-4">Resources</p> */}
      </div>

      {/* Main Section */}
      <section className="w-full px-8 sm:px-0 sm:w-3/4 mx-auto pt-7 pb-4">
        <div className="flex overflow-x-auto gap-2 mb-6">
          {CONTENT_TYPES.map((type) => (
            <Button
              key={type.id}
              variant={activeType === type.id ? "default" : "outline"}
              onClick={() => setActiveType(type.id)}
              className="flex items-center gap-2"
            >
              {type.icon}
              {type.name}
            </Button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {CONTENT_TYPES.find((t) => t.id === activeType)?.name}
          </h2>
          <Button asChild>
            <Link href={`/${activeType}/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Link>
          </Button>
        </div>

        <div className="space-y-4">{renderContent()}</div>
      </section>
    </main>
  );
}
