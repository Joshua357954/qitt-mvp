"use client";

import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import { Toaster, toast } from "react-hot-toast"; // Added toast
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import useDepartmentStore from "@/app/store/departmentStore";
import useAssignmentStore from "@/app/store/creator/assignmentStore";

export default function CreatorAssignment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const [assignment, setAssignment] = useState(null);
  const [fetching, setFetching] = useState(false);

  const {
    course,
    description,
    dateGiven,
    dueDate,
    files,
    existingFiles,
    setExistingFiles,
    isLoading,
    success,
    setCourse,
    setDescription,
    setDateGiven,
    setDueDate,
    addFiles,
    removeFile,
    uploadAssignment,
  } = useAssignmentStore();

  const [previewFiles, setPreviewFiles] = useState([]);
  const { getItem } = useDepartmentStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEditMode) {
      const today = new Date().toISOString().split("T")[0];
      setDateGiven(today);
    }
  }, [isEditMode, setDateGiven]);

  useEffect(() => {
    setPreviewFiles((prev) => [...prev, ...files, existingFiles]);
  }, [existingFiles, files]);

  // Fetch assignment details if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      const fetchAssignment = async () => {
        setFetching(true);
        try {
          const fetchedAssignment = await getItem("assignments", editId);
          setAssignment(fetchedAssignment);
          setCourse(fetchedAssignment.course ?? "");
          setDescription(fetchedAssignment.description ?? "");
          setDateGiven(fetchedAssignment.dateGiven ?? "");
          setDueDate(fetchedAssignment.dueDate ?? "");

          const prevFiles = event.target.files.map((file) => {
            return {
              ...file,
              existing: true,
            };
          });

          setExistingFiles(prevFiles);
        } catch (error) {
          toast.error("Error fetching assignment details.");
        } finally {
          setFetching(false);
        }
      };
      fetchAssignment();
    }
  }, [isEditMode, editId]);


  // Handle file addition with size validation
  const addFilesHandler = (event) => {
    const uploadedFiles = Array.from(event.target.files).map((file, index) => {
      const objectUrl = URL.createObjectURL(file);

      // Check file size (for example, limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return null; // Skip this file
      }

      return {
        id: `${file.name}-${Date.now()}-${index}`,
        src: objectUrl,
        url: objectUrl,
        file,
      };
    }).filter(file => file !== null); // Filter out invalid files

    if (uploadedFiles.length > 0) {
      setPreviewFiles((prev) => [...prev, ...uploadedFiles]);
      addFiles(uploadedFiles);
    }
  };

  // Cleanup URLs for object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewFiles.forEach((file) => URL.revokeObjectURL(file.src));
    };
  }, [previewFiles]);



  // Handle assignment upload
  const handleUploadAssignment = async () => {
    await uploadAssignment();
  };

  return (
    <CreatorLayout
      screenName={`${isEditMode ? "Edit" : ""} Assignment`}
      Button={
        <button
          onClick={handleUploadAssignment} // Use custom upload function
          disabled={isLoading || fetching}
          className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded disabled:opacity-50"
        >
          {isLoading ? (
            "Uploading..."
          ) : (
            <>
              <Upload size={15} /> {isEditMode ? "Update" : "Add"} Assignment
            </>
          )}
        </button>
      }
    >
      <Toaster position="top-center" />

      <div>
        <Dropdown
          label="Course"
          dropdownItems={["CSC 240", "MTH 101", "PHY 112"]}
          value={course}
          onChange={setCourse}
        />
      </div>

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

      <CreatorFilesPreview files={previewFiles} removeFile={removeFile} />

      {/* Mobile Button */}
      <button
        onClick={handleUploadAssignment} // Use custom upload function
        disabled={isLoading || fetching}
        className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-full mx-auto my-4 disabled:opacity-50"
      >
        {isLoading ? (
          "Uploading..."
        ) : (
          <>
            <Upload size={15} />
            {isEditMode ? "Update" : "Add"} Assignment
          </>
        )}
      </button>
    </CreatorLayout>
  );
}
