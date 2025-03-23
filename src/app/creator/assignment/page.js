"use client";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import { PlusCircle, Upload } from "lucide-react";
import useAssignmentStore from "@/app/store/creator/assignmentStore";
import React, { useEffect } from "react";

export default function CreatorAssignment() {
  const {
    course,
    description,
    dateGiven,
    dueDate,
    files,
    setCourse,
    setDescription,
    setDateGiven,
    setDueDate,
    addFiles,
  } = useAssignmentStore();

  // Set default date to today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
    setDateGiven(today);
  }, [setDateGiven]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    addFiles(uploadedFiles);
  };

  return (
    <CreatorLayout
      screenName="Assignment"
      Button={
        <button className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded">
          <Upload size={15} /> Add Assignment
        </button>
      }
    >
      {/* Course Selection */}
      <div>
        <Dropdown
          label="Course"
          dropdownItems={["CSC 240", "MTH 101", "PHY 112"]}
          value={course}
          onChange={setCourse}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-bold">Description</label>
        <textarea
          className="p-1 resizable-none border border-black rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Date Inputs */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <label className="font-bold">Date Given</label>
          <input
            type="date"
            value={dateGiven}
            onChange={(e) => setDateGiven(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-bold">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* File Upload */}
      <label className="border p-3 border-dashed flex rounded justify-center items-center gap-5 border-[#0A32F8] text-[#0A32F8] cursor-pointer">
        <PlusCircle color="#0A32F8" /> Upload Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {/* File Preview */}
      <div className="w-full">
        <CreatorFilesPreview files={files} />
      </div>

      {/* Mobile Upload Button */}
      <button className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4">
        <Upload size={15} /> Add Assignment
      </button>
    </CreatorLayout>
  );
}
