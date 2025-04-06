"use client";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import CreatorLayout from "@/components/CreatorLayout";
import { Dropdown } from "@/components/Dropdown";
import { PlusCircle, Upload } from "lucide-react";
import useNoteStore from "@/app/store/creator/noteStore";
import React from "react";
import { AiOutlineNotification as Announce } from "react-icons/ai";

export default function Announcement() {
  return (
    <CreatorLayout
      screenName="Announcement"
      Button={
        <button className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded">
          <Announce size={15} /> Announce
        </button>
      }
    >
      Announcement
    </CreatorLayout>
  );
}
