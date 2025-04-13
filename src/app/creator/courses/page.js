"use client";

import React, { useRef, useEffect, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import CreatorLayout from "@/components/CreatorLayout";
import useCourseStore from "@/app/store/creator/coursesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function CreatorCourses() {
  const {
    course,
    isUploading,
    updateCourse,
    addCourse,
    uploadCourses,
  } = useCourseStore();

  const [editorContent, setEditorContent] = useState(course.outline || "");
  const quillRef = useRef(null);

  // Update store when editor content changes
  useEffect(() => {
    updateCourse("outline", editorContent);
  }, [editorContent]);

  // Quill modules config
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
  ];

  return (
    <CreatorLayout
      screenName="Course Data"
      Button={
        <Button
          onClick={uploadCourses}
          disabled={isUploading}
          className="hidden sm:flex gap-2"
        >
          <Upload size={15} />
          {isUploading ? "Uploading..." : "Upload Courses"}
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Input Fields */}
        <div className="grid gap-4">
          {inputFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                name={field.name}
                value={course[field.name] || ""}
                onChange={(e) => updateCourse(field.name, e.target.value)}
                placeholder={field.placeholder}
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

        {/* Add Course Button */}
        <Button onClick={addCourse} className="w-full py-2 sm:hidden gap-2">
          <PlusCircle size={16} />
          Add Course
        </Button>
      </div>
    </CreatorLayout>
  );
}
