"use client";

import React, { useRef, useEffect, useState } from "react";
import { PlusCircle, Upload, Save, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import CreatorLayout from "@/components/CreatorLayout";
import useCourseStore from "@/app/store/creator/coursesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import useDepartmentStore from "@/app/store/departmentStore";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function CreatorCourses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const {
    course,
    isUploading,
    isLoading,
    updateCourse,
    uploadCourses,
    setCourseData,
    resetCourse,
  } = useCourseStore();

  const { courses, fetchCourses } = useDepartmentStore();
  const [editorContent, setEditorContent] = useState("");
  const quillRef = useRef(null);

  // Initialize form based on mode
  useEffect(() => {
    const initializeForm = async () => {
      if (isEditMode) {
        try {
          if (!courses?.length) {
            await fetchCourses();
          }

          const updatedCourses = useDepartmentStore.getState().courses;
          const found = updatedCourses?.find((course) => course.id === editId);

          if (found) {
            setCourseData(found);
            setEditorContent(found.outline || "");
          } else {
            console.warn("No course found with ID:", editId);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          toast.error(`Failed to load course data: ${error?.message}`);
        }
      } else {
        resetCourse();
        setEditorContent("");
      }
    };

    initializeForm();
  }, [isEditMode, editId, fetchCourses, resetCourse]);

  // Update store when editor content changes
  useEffect(() => {
    updateCourse("outline", editorContent);
  }, [editorContent, updateCourse]);

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ list: "ordered" }],
      ["bold", "italic", "underline"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const inputFields = [
    {
      label: "Course Code",
      name: "code",
      type: "text",
      placeholder: "CSC280.2",
      required: true,
    },
    {
      label: "Title",
      name: "title",
      type: "text",
      placeholder: "Introduction to Programming",
      required: true,
    },
    {
      label: "Credit Unit",
      name: "creditUnit",
      type: "number",
      placeholder: "3",
      required: false,
    },
    {
      label: "Lecturers Name",
      name: "lecturers",
      type: "text",
      placeholder: "Dr. John Doe, Mrs. Lilian",
      required: true,
    },
  ];

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await uploadCourses(editId);
        toast.success("Course updated successfully");
      } else {
        await uploadCourses();
        toast.success("Course created successfully");
        // router.push("/creator/type/courses"); // optional redirect
      }
    } catch (error) {
      toast.error("An error occurred while saving the course.");
    }
  };

  if (isLoading) {
    return (
      <CreatorLayout
        screenName={isEditMode ? "Loading Course..." : "Create Course"}
      >
        <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading course data...</p>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout
      screenName={isEditMode ? `Edit: ${course.title}` : "Create New Course"}
      Button={
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="hidden sm:flex gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isEditMode ? (
            <>
              <Save size={15} />
              Update Course
            </>
          ) : (
            <>
              <PlusCircle size={15} />
              Create Course
            </>
          )}
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Input Fields */}
        <div className="grid gap-4">
          {inputFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                type={field.type}
                name={field.name}
                value={course[field.name] || ""}
                onChange={(e) => updateCourse(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}

          {/* Course Outline with Quill Editor */}
          <div className="space-y-2">
            <Label>Course Outline</Label>
            <div className="h-[300px] mb-12">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                modules={modules}
                formats={formats}
                className="h-[250px] bg-white"
                placeholder="Enter detailed course outline..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button (Mobile) */}
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full py-2 sm:hidden gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isEditMode ? (
            <>
              <Save size={16} />
              Update Course
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              Create Course
            </>
          )}
        </Button>
      </div>
    </CreatorLayout>
  );
}
