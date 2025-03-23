"use client";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import { Dropdown } from "@/components/Dropdown";
import { ArrowLeft, PlusCircle, Upload } from "lucide-react";
import useResourceStore from "@/app/store/creator/resourcesStore";
import CreatorLayout from "@/components/CreatorLayout";

export default function CreatorResources() {
  const {
    title,
    description,
    course,
    type,
    files,
    setField,
    addFiles,
    removeFile,
    uploadResources,
    isLoading,
  } = useResourceStore();

  return (
    <CreatorLayout
      screenName={"Resources"}
      Button={
        <button
          onClick={uploadResources}
          className={`hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          <Upload size={15} /> {isLoading ? "Uploading..." : "Add Resources"}
        </button>
      }
    >
      {/* Main Content */}
      <div className="flex flex-col">
        <label className="font-bold">Title</label>
        <input
          className="border border-black px-2 py-2 rounded"
          value={title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="font-bold">Description</label>
        <textarea
          className="p-1 resizable-none border border-black rounded"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
        ></textarea>
      </div>

      {/* Dropdowns */}
      <div className="flex gap-4">
        <Dropdown
          label="Course"
          dropdownItems={["CSC 240", "MTH 101", "PHY 112"]}
          value={course}
          onChange={(value) => setField("course", value)}
        />
        <Dropdown
          label="Type"
          dropdownItems={["Note", "Assignment", "Lecture"]}
          value={type}
          onChange={(value) => setField("type", value)}
        />
      </div>

      {/* File Upload */}
      <label className="border p-3 border-dashed flex rounded justify-center items-center gap-5 border-[#0A32F8] text-[#0A32F8] cursor-pointer">
        <PlusCircle color="#0A32F8" /> Add Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {/* File Preview */}
      <CreatorFilesPreview files={files} removeFile={removeFile} />

      {/* Mobile Upload Button */}
      <button
        onClick={uploadResources}
        className={`flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        <Upload size={15} /> {isLoading ? "Uploading..." : "Add Resources"}
      </button>
    </CreatorLayout>
  );
}
