"use client";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import { PlusCircle, Upload } from "lucide-react";
import useNoteStore from "@/app/store/creator/noteStore";
import React from "react";

export default function CreatorNote() {
  const {
    course,
    description,
    files,
    setCourse,
    setDescription,
    addFiles,
    uploadNote,
    loading,
  } = useNoteStore();

  return (
    <CreatorLayout
      screenName="Lecture Note"
      Button={
        <button
          onClick={uploadNote}
          disabled={loading}
          className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded"
        >
          {loading ? (
            "Uploading..."
          ) : (
            <>
              <Upload size={15} /> Add Note
            </>
          )}
        </button>
      }
    >
      {/* Course Selection */}
      <Dropdown
        label="Course"
        dropdownItems={["CSC 240", "MTH 101", "PHY 112"]}
        value={course}
        onChange={setCourse}
      />

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-bold">Description</label>
        <textarea
          className="p-1 resizable-none border border-black rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* File Upload */}
      <label className="border p-3 border-dashed flex rounded justify-center items-center gap-5 border-[#0A32F8] text-[#0A32F8] cursor-pointer">
        <PlusCircle color="#0A32F8" /> Upload Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(Array.from(e.target.files))}
        />
      </label>

      {/* File Preview */}
      <div className="w-full">
        <CreatorFilesPreview files={files} />
      </div>

      {/* Mobile Upload Button */}
      <button
        onClick={uploadNote}
        disabled={loading}
        className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-4/5 mx-auto my-4"
      >
        {loading ? (
          "Uploading..."
        ) : (
          <>
            <Upload size={15} /> Add Note
          </>
        )}
      </button>
    </CreatorLayout>
  );
}
