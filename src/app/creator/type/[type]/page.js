"use client";

import { useState, useEffect } from "react";
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

  const isValidType = CONTENT_TYPES.some((type) => type.id === urlType);
  const [activeType, setActiveType] = useState(
    isValidType ? urlType : "assignments"
  );
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
    resources,
    fetchResources,
    deleteItem,
    loading,
  } = useDepartmentStore();

  // Sync URL with active type
  useEffect(() => {
    if (activeType && activeType !== urlType) {
      router.push(`/creator/type/${activeType}`);
    }
  }, [activeType, router, urlType]);

  // Fetch data based on active type
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (activeType === "courses" && courses.length === 0) {
          await fetchCourses();
        }
        if (activeType === "announcements" && announcements.length === 0) {
          console.log("Fetching Announcement in progress");
          await fetchAnnouncements();
        }
        if (activeType === "timetable" && timetables.length === 0) {
          console.log("Fetching Timetable in progress");
          await fetchTimetable();
          console.log('Second :',timetables);
        }
        if (activeType === "assignments" && assignments.length === 0) {
          await fetchAssignments();
        }
        if (activeType === "resources" && resources.length === 0) {
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
    assignments.length,
    courses.length,
    announcements.length,
    timetables?.length,
    resources?.length

  ]);

  useEffect(() => {
    if (activeType === "courses") {
      setItems(courses || []);
    } else if (activeType === "announcements") {
      console.log("Found Announcements", announcements);
      setItems(announcements || []);
    } else if (activeType === "timetable") {
      console.log("Found Timetable (New)", timetables);
      setItems(timetables);
    } else if (activeType === "assignments") {
      console.log("Found Assignments (New)", assignments);
      setItems(assignments);
    } else if (activeType === "resources") {
      console.log("Found Resources (New)", resources);
      setItems(resources);
    } else {
      setItems([]);
    }
  }, [activeType, courses, announcements,timetables, assignments, resources]);


  const handleDelete = (type, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteItem(type, id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };


  const renderContent = () => {
    if (isLoading) return <LoadingState className="mt-8" />;
    if (items?.length === 0)
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

    return items?.map((item) => (
      <CardComponent
        key={item.id}
        item={item}
        onDelete={() => handleDelete(activeType, item.id)}
      />
    ));
  };
 
  const currentContentType =
    CONTENT_TYPES.find((type) => type.id === activeType)?.name || "Content";

  return (
    <main className="w-full font-aeonik">
      {/* Nav 1 */}
      <div className="flex gap-5 items-center p-5 border-b border-gray-500 bg-blue-900">
        <Link href="/">
          <ArrowLeft size={20} color={"white"} />
        </Link>
        <p className=" text-2xl font-bold text-white">Creator Dashboard</p>
      </div>

      {/* Main Section */}
      <section className="w-full px-8 sm:px-0 sm:w-3/4 mx-auto pt-7 pb-4">
        <div className="flex overflow-x-auto gap-2 mb-6">
          {CONTENT_TYPES.map((type) => (
            <Button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`flex items-center gap-2  ${
                activeType === type.id
                  ? "bg-blue-800 text-white hover:bg-blue-800 "
                  : "bg-white text-black hover:bg-blue-800 hover:text-white"
              }`}
            >
              {type.icon}
              {type.name}
            </Button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize">{activeType}</h2>
          <Button asChild className="bg-blue-800">
            <Link href={`/creator/${activeType}/`}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Link>
          </Button>
        </div>

        {/* Debug info (optional) */}
        {/* <pre>{JSON.stringify(courses, null, 2)}</pre> */}
        {/* {loading && "Loading In Progress"} */}
        <div className="space-y-4">{renderContent()}</div>
      </section>
    </main>
  );
}
