"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTENT_TYPES } from "./data";
import {
  ContentHeader,
  ContentTabs,
  AssignmentCard,
  AnnouncementCard,
  CourseCard,
  ResourceCard,
  NoteCard,
  TimetableCard,
  LoadingState,
  EmptyState,
} from "./sd-components";
import useCoursesStore from "@/app/store/creator/coursesStore";
import useDepartmentStore from "@/app/store/departmentStore";

export default function CreatorPage() {
  const router = useRouter();
  const params = useParams();
  const urlType = params?.type;

  const [activeType, setActiveType] = useState("assignments");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    fetchCourses,
    courses,
    fetchAnnouncements,
    announcements,
    fetchTimetable,
    timetables,
    fetchAssignments,
    assignments,
    fetchResources,
    resources,
    deleteItem,
  } = useDepartmentStore();

  useEffect(() => {
    if (urlType && CONTENT_TYPES.some((type) => type.id === urlType)) {
      setActiveType(urlType);
    }
  }, [urlType]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (activeType === "courses" && courses.length === 0) {
          await fetchCourses();
        } else if (
          activeType === "announcements" &&
          announcements.length === 0
        ) {
          await fetchAnnouncements();
        } else if (activeType === "timetable" && timetables.length === 0) {
          await fetchTimetable();
        } else if (activeType === "assignments" && assignments.length === 0) {
          await fetchAssignments();
        } else if (activeType === "resources" && resources.length === 0) {
          await fetchResources();
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [
    activeType,
    fetchCourses,
    fetchAnnouncements,
    fetchTimetable,
    fetchAssignments,
    fetchResources,
    courses.length,
    announcements.length,
    timetables.length,
    assignments.length,
    resources.length,
  ]);

  useEffect(() => {
    switch (activeType) {
      case "courses":
        setItems(courses);
        break;
      case "announcements":
        setItems(announcements);
        break;
      case "timetable":
        setItems(timetables);
        break;
      case "assignments":
        setItems(assignments);
        break;
      case "resources":
        setItems(resources);
        break;
      default:
        setItems([]);
    }
  }, [activeType, courses, announcements, timetables, assignments, resources]);

  const handleDelete = (type, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteItem(type, id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const renderContent = () => {
    if (isLoading) return <LoadingState className="mt-8" />;
    if (items.length === 0)
      return <EmptyState activeType={activeType} className="mt-8 mx-auto" />;

    const cardComponents = {
      courses: CourseCard,
      assignments: AssignmentCard,
      announcements: AnnouncementCard,
      notes: NoteCard,
      timetable: TimetableCard,
      resources: ResourceCard,
    };

    const CardComponent = cardComponents[activeType];
    return items.map((item) => (
      <CardComponent
        key={item.id}
        item={item}
        onDelete={() => handleDelete(activeType, item.id)}
      />
    ));
  };

  const buttonRefs = useRef({});

  const handleClick = (id) => {
    router.push(`/creator/type/${id}`);
    if (buttonRefs.current[id]) {
      buttonRefs.current[id].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <main className="w-full font-aeonik">
      <div className="flex gap-5 items-center p-5 border-b border-gray-500 bg-blue-900">
        <Link href="/">
          <ArrowLeft size={20} color="white" />
        </Link>
        <p className="text-2xl font-bold text-white">Creator Dashboard</p>
      </div>

      <section className="w-full px-8 sm:px-0 sm:w-3/4 mx-auto pt-7 pb-4">
        <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar whitespace-nowrap">
          {CONTENT_TYPES.map((type) => (
            <Button
              key={type.id}
              ref={(el) => (buttonRefs.current[type.id] = el)}
              onClick={() => handleClick(type.id)}
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeType === type.id
                  ? "bg-blue-800 text-white hover:bg-blue-200 hover:text-black"
                  : "bg-white text-black hover:bg-blue-200 hover:text-black"
              }`}
            >
              {type.icon}
              {type.name}
            </Button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize">
            {activeType.toLowerCase() === "announcements"
              ? "Notice"
              : activeType}
          </h2>
          {(activeType !== "timetable" || timetables.length === 0) && (
            <Button asChild className="bg-blue-800">
              <Link href={`/creator/${activeType}/`}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Link>
            </Button>
          )}
        </div>

        <div className="space-y-4">{renderContent()}</div>
      </section>
    </main>
  );
}
