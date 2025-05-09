"use client";

import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import { Toaster, toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
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

  // Initialize date if not in edit mode
  useEffect(() => {
    if (!isEditMode) {
      const today = new Date().toISOString().split("T")[0];
      setDateGiven(today);
    }
  }, [isEditMode, setDateGiven]);

  // Fetch assignment details if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      const fetchAssignment = async () => {
        setFetching(true);
        try {
          const fetchedAssignment = await getItem("assignments", editId);
          setAssignment(fetchedAssignment);

          // Populate state
          setCourse(fetchedAssignment.course ?? "");
          setDescription(fetchedAssignment.description ?? "");
          setDateGiven(fetchedAssignment.dateGiven ?? "");
          setDueDate(fetchedAssignment.dueDate ?? "");

          // Transform existing files into the format expected by your preview
          const prevFiles = fetchedAssignment.files;

          setExistingFiles(prevFiles);
          setPreviewFiles((prev) => [...prev, ...prevFiles]);
        } catch (error) {
          toast.error("Error fetching assignment details.");
        } finally {
          setFetching(false);
        }
      };
      fetchAssignment();
    }
  }, [
    isEditMode,
    editId,
    getItem,
    setCourse,
    setDescription,
    setDateGiven,
    setDueDate,
  ]);

  // Handle file addition with size validation
  const addFilesHandler = (event) => {
    const uploadedFiles = Array.from(event.target.files)
      .map((file, index) => {
        const objectUrl = URL.createObjectURL(file);

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 10MB.`);
          return null;
        }

        return {
          id: `${file.name}-${Date.now()}-${index}`,
          src: objectUrl,
          url: objectUrl,
          file,
        };
      })
      .filter((file) => file !== null);

    if (uploadedFiles.length > 0) {
      setPreviewFiles((prev) => [...prev, ...uploadedFiles]);
      addFiles(uploadedFiles);
    }
  };

  useEffect(() => {
    console.log("Syncing previewFiles...");
    const mergedFiles = [...files, ...existingFiles];
    // Avoid duplicates (compare by `id`)
    const uniqueFiles = mergedFiles.filter(
      (file, index, self) => index === self.findIndex((f) => f.url === file.url)
    );
    console.log("Merged Files: ", uniqueFiles);
    setPreviewFiles(uniqueFiles);
  }, [files, existingFiles]);

  // Handle assignment upload
  const handleUploadAssignment = async () => {
    await uploadAssignment(editId);
    router.back()
  };

  return (
    <CreatorLayout
      screenName={`${isEditMode ? "Edit" : ""} Assignment`}
      Button={
        <button
          onClick={handleUploadAssignment}
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

      <Dropdown
        label="Course"
        dropdownItems={["CSC 240", "MTH 101", "PHY 112"]}
        value={course}
        onChange={setCourse}
      />

      <div className="flex flex-col">
        <label className="font-bold">Description</label>
        <textarea
          className="p-1 resize-none border border-black rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    
      <div className="flex justify-between w-full">
        <input
          type="date"
          className="border border-black py-2 px-1 rounded-sm"
          value={dateGiven}
          onChange={(e) => setDateGiven(e.target.value)}
        />
        <input
          type="date"
          className="border border-black py-2 px-1 rounded-sm"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.png"
        className="hidden"
        onChange={addFilesHandler}
      />
      <label
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-blue-600 p-4 rounded-lg flex items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition duration-300"
      >
        <PlusCircle className="text-blue-600" />
        <span className="text-blue-600 font-medium">Add Files</span>
      </label>

      <CreatorFilesPreview files={previewFiles} removeFile={removeFile} />

      {/* Mobile Button */}
      <button
        onClick={handleUploadAssignment}
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
