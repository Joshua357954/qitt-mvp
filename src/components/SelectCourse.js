import React, { useEffect, useState } from "react";
import useDepartmentStore from "@/app/store/departmentStore";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Dropdown } from "./Dropdown";
import { Button } from "./ui/button";

export default function SelectCourse({ value, handler }) {
  const { courses, loading, fetchCourses } = useDepartmentStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (courses?.length) return;
    setIsLoading(true);
    fetchCourses().finally(() => setIsLoading(false));
  }, [fetchCourses, courses?.length]);

  if (loading || isLoading) {
    return <div className="flex flex-col min-w-full w-full">
      <p className="font-bold text-sm">Course</p>
      <p className="p-2 mt-[0.1rem]  rounded-sm border border-black">Loading...</p>
      </div>;
  }

  return courses?.length > 0 ? (
    <div className="space-y-4">
      <Dropdown
        label="Course"
        dropdownItems={courses.map((c) => c.code)}
        onChange={handler}
        value={value}
        placeholder="Select"
      />
    </div>
  ) : (
    <div className="flex flex-col items-center text-center">
      <Link href="/creator/courses">
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Course
        </Button>
      </Link>
    </div>
  );
}
