"use client";
import React, { useEffect, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import useResourceStore from "@/app/store/creator/resourcesStore";
import CreatorLayout from "@/components/CreatorLayout";
import { useRouter, useSearchParams } from "next/navigation";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import useDepartmentStore from "@/app/store/departmentStore";
import { Dropdown } from "@/components/Dropdown";

export default function CreatorResources() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);
  const { getItem } = useDepartmentStore();

  const {
    title,
    description,
    course,
    type,
    files,
    setField,
    addFiles,
    removeFile,
    uploadResource,
    updateResource,
    isLoading,
    existingFiles,
    setExistingFiles,
  } = useResourceStore();

  const [previewFiles, setPreviewFiles] = useState([]);

  useEffect(() => {
    if (isEditMode && editId) {
      const fetchResource = async () => {
        try {
          const resource = await getItem("resources", editId);
          setField("title", resource.title);
          setField("description", resource.description);
          setField("course", resource.course);
          setField("type", resource.type);
          setExistingFiles(resource.files || []);
        } catch (error) {
          console.error("Error fetching resource details:", error);
        }
      };
      fetchResource();
    }
  }, [isEditMode, editId, setField]);

  const handleFileChange = (event) => {
    const newFiles = event.target.files;
    if (newFiles.length > 0) {
      setPreviewFiles((prev) => [...prev, ...newFiles]);
      addFiles(newFiles);
    }
  };

  useEffect(() => {
    const mergedFiles = [...files, ...existingFiles];
    const uniqueFiles = mergedFiles.filter(
      (file, index, self) => index === self.findIndex((f) => f.url === file.url)
    );
    setPreviewFiles(uniqueFiles);
  }, [files, existingFiles]);

  const handleSave = async () => {
    if (isEditMode) {
      await uploadResource(editId);
      router.back()
    } else {
      await uploadResource();
      setField('');
      setField('');
      setField('');
      setField('');
      setExistingFiles([]);
    }
  };

  return (
    <CreatorLayout
      screenName={`${isEditMode ? "Edit" : ""} Resources`}
      Button={
        <button
          onClick={handleSave}
          className={`hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          <Upload size={15} />
          {isLoading
            ? "Saving..."
            : isEditMode
            ? "Update Resource"
            : "Add Resource"}
        </button>
      }
    >
      <div className="flex flex-col mb-4">
        <label className="font-bold">Title</label>
        <input
          className="border border-black px-2 py-2 rounded"
          value={title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>

      <div className="flex flex-col mb-4">
        <label className="font-bold">Description</label>
        <textarea
          className="p-1 resizable-none border border-black rounded"
          value={description}
          onChange={(e) => setField("description", e.target.value)}
        ></textarea>
      </div>

      <div className="flex gap-4 mb-4">
        <Dropdown
          label="Course"
          dropdownItems={["CSC 240", "MTH 101", "PHY 112"]}
          value={course}
          onChange={(value) => setField("course", value)}
        />
        <Dropdown
          label="Type"
          dropdownItems={["Note", "Past Question", "Study Tool"]}
          value={type}
          onChange={(value) => setField("type", value)}
        />
      </div>

      <label className="border-2 border-dashed border-blue-600 p-4 rounded-lg flex items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition duration-300">
        <PlusCircle color="#0A32F8" /> Add Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <CreatorFilesPreview files={previewFiles} removeFile={removeFile} />

      <button
        onClick={handleSave}
        className={`flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        <Upload size={15} />
        {isLoading
          ? "Saving..."
          : isEditMode
          ? "Update Resource"
          : "Add Resource"}
      </button>
    </CreatorLayout>
  );
}
