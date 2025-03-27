"use client";
import React, { useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import CreatorLayout from "@/components/CreatorLayout";

export default function CreatorCourses() {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);

  const addCourse = () => {
    if (courseName.trim() !== "") {
      setCourses([...courses, courseName]);
      setCourseName("");
    }
  };

  return (
    <CreatorLayout
      screenName="Courses Data"
      Button={
        <button
          className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded"
        >
          <Upload size={15} /> Add Courses Data
        </button>
      }
    >
      {/* Input Section */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter course name..."
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
        <button
          onClick={addCourse}
          className="flex items-center gap-1 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          <PlusCircle size={20} />
          Add
        </button>
      </div>
    </CreatorLayout>
  );
}
