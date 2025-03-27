"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { PlusCircle, Upload } from "lucide-react";
import CreatorLayout from "@/components/CreatorLayout";
import useCourseStore from "@/app/store/creator/coursesStore"; // Import Zustand store

export default function CreatorCourses() {
  const {
    course,
    courses,
    isUploading,
    updateCourse,
    addCourse,
    uploadCourses,
  } = useCourseStore();

  return (
    <CreatorLayout
      screenName="Course Data"
      Button={
        <button
          onClick={uploadCourses}
          disabled={isUploading}
          className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload size={15} /> Upload Courses
            </>
          )}
        </button>
      }
    >
      <div className="p-4">
        {/* Input Fields */}
        <div className="flex flex-col gap-5">
          {[
            {
              label: "Course Code",
              name: "code",
              type: "text",
              placeholder: "CSC280.2",
            },
            {
              label: "Title",
              name: "title",
              type: "text",
              placeholder: "Fortran",
            },
            {
              label: "Credit Unit",
              name: "creditUnit",
              type: "number",
              placeholder: "3",
            },
            {
              label: "Lecturer's Name",
              name: "lecturer",
              type: "text",
              placeholder: "Dr. John Doe",
            },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="font-semibold text-black">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={course[field.name]}
                onChange={(e) => updateCourse(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="p-2 border border-black rounded-sm"
              />
            </div>
          ))}

          {/* Course Outline */}
          <div className="flex flex-col">
            <label className="font-semibold text-black">Course Outline</label>
            <textarea
              name="outline"
              value={course.outline}
              onChange={(e) => updateCourse("outline", e.target.value)}
              placeholder="Enter course outline (Markdown supported)"
              className="p-2 border border-black rounded-sm"
              rows={2}
            />
          </div>
        </div>

        {/* Add Course Button */}
        <button
          onClick={addCourse}
          className="mt-4 px-4 py-2 bg-[#0A32F8] text-white rounded flex items-center gap-2 w-full justify-center "
        >
          <PlusCircle size={16} className="mb-[0.2rem]"/> Add Course
        </button>
      </div>
    </CreatorLayout>
  );
}
