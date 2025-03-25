"use client";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
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
    <CreatorLayout>
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
