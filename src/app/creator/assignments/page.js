"use client";

import React, { useEffect, useRef } from "react";
import { PlusCircle, Upload } from "lucide-react";
import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import { Toaster } from "react-hot-toast"; // Ensure to show toasts
import useAssignmentStore from "@/app/store/creator/assignmentStore";

export default function CreatorAssignment() {
  const {
    course,
    description,
    dateGiven,
    dueDate,
    files,
    isLoading,
    success,
    setCourse,
    setDescription,
    setDateGiven,
    setDueDate,
    addFiles,
    removeFile,
    uploadAssignment,
    // Reset values manually since store doesn’t have a clearAll method
  } = useAssignmentStore();

  const fileInputRef = useRef(null);

  // Set default "Date Given" to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateGiven(today);
  }, [setDateGiven]);

  // Reset form when upload is successful
  useEffect(() => {
    if (success) {
      setCourse("");
      setDescription("");
      setDateGiven(new Date().toISOString().split("T")[0]);
      setDueDate("");
      addFiles([]); // Clear files
    }
  }, [success, setCourse, setDescription, setDateGiven, setDueDate, addFiles]);

  // Handle file uploads
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
          {isLoading ? (
            "Uploading..."
          ) : (
            <>
              <Upload size={15} /> Add Assignment
            </>
          )}
        </button>
      }
    >
      <Toaster position="top-center" />

      {/* Course Dropdown */}
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
          className="p-1 resize-none border border-black rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Dates */}
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
        accept=".pdf,.doc,.docx,.jpg,.png"
        className="hidden"
        onChange={addFilesHandler}
      />

      {/* Label for File Upload */}
      <label
        onClick={() => fileInputRef.current?.click()}
        className="border p-3 border-dashed flex rounded justify-center items-center gap-5 border-[#0A32F8] text-[#0A32F8] cursor-pointer"
      >
        <PlusCircle color="#0A32F8" /> Add Files
      </label>

      {/* File Previews */}
      <CreatorFilesPreview files={files} removeFile={removeFile} />

      {/* Mobile Button */}
      <button
        onClick={uploadAssignment}
        disabled={isLoading}
        className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4 disabled:opacity-50"
      >
        {isLoading ? (
          "Uploading..."
        ) : (
          <>
            <Upload size={15} /> Add Assignment
          </>
        )}
      </button>
    </CreatorLayout>
  );
}
