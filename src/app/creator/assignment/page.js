"use client";

import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import { PlusCircle, Upload } from "lucide-react";
import useAssignmentStore from "@/app/store/creator/assignmentStore";
import React, { useEffect, useRef } from "react";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";

export default function CreatorAssignment() {
  const {
    course,
    description,
    dateGiven,
    dueDate,
    files,
    isLoading,
    setCourse,
    setDescription,
    setDateGiven,
    setDueDate,
    addFiles,
    removeFile,
    uploadAssignment,
  } = useAssignmentStore();

  const fileInputRef = useRef(null);

  // Set default date to today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateGiven(today);
  }, [setDateGiven]);

  // Handle File Upload
  const addFilesHandler = (event) => {
    const uploadedFiles = Array.from(event.target.files).map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      link: URL.createObjectURL(file),
      file,
    }));

    addFiles(uploadedFiles);
  };

  return (
    <CreatorLayout
      screenName="Assignment"
      Button={
        <button
          onClick={uploadAssignment}
          disabled={isLoading}
          className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded disabled:opacity-50"
        >
          {isLoading ? "Uploading..." : <><Upload size={15} /> Add Assignment</>}
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
      <div className="flex justify-between gap-5 w-full">
        <div className="flex flex-col flex-1 min-w-0">
          <label className="font-bold">Date Given</label>
          <input
            type="date"
            value={dateGiven}
            onChange={(e) => setDateGiven(e.target.value)}
            className="border border-black p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <label className="font-bold">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-black p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={addFilesHandler}
      />

      {/* File Upload Label */}
      <label
        className="border p-3 border-dashed flex rounded justify-center items-center gap-5 border-[#0A32F8] text-[#0A32F8] cursor-pointer"
      >
        <input type="file" multiple className="hidden" onChange={addFilesHandler} />
        <PlusCircle color="#0A32F8" /> Add Files
      </label>

      {/* File Preview */}
      <CreatorFilesPreview files={files} removeFile={removeFile} />

      {/* Mobile Upload Button */}
      <button
        onClick={uploadAssignment}
        disabled={isLoading}
        className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4 disabled:opacity-50"
      >
        {isLoading ? "Uploading..." : <><Upload size={15} /> Add Assignment</>}
      </button>
    </CreatorLayout>
  );
}
