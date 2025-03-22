"use client";
import CreatorFilesPreview from "@/components/CreatorFilesPreview";
import { Dropdown } from "@/components/Dropdown";
import {
  ArrowLeft,
  PlusCircle,
  Upload,
} from "lucide-react/dist/cjs/lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function CreatorTimetable() {
  const [day, setDay] = useState("friday");
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  return (
    <main className="w-full font-aeonik ">
      {/* Nav 1 */}
      <div className="flex gap-5 items-center p-5 border-b border-gray-500">
        <Link href="/creator">
          <ArrowLeft size={20} />
        </Link>
        <p className="text-2xl font-bold ">Creator</p>
      </div>

      {/* Main Stuff */}
      <section className="w-full px-8 sm:px-0 sm:w-3/4 mx-auto">
        {/* Nav 2 */}
        <nav className="flex sm:justify-between justify-center py-4 items-center border-b border-gray-600">
          <h2 className="text-xl text-center font-semibold ">Assignment</h2>
          <button className="hidden sm:flex justify-center items-center px-4 py-2 text-white bg-[#0A32F8] gap-3 rounded">
            <Upload size={15} /> Add Assignment
          </button>
        </nav>

        {/* Main */}
        <div className="w-4/5 sm:w-1/3 mx-auto py-5  flex flex-col gap-7">
          <div className="">
            <Dropdown label="Course" dropdownItems={["CSC 240"]} />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">Description</label>
            <textarea className="p-1 resizable-none border border-black rounded"></textarea>
          </div>

          {/* Drowdowns */}
          <div className="flex gap-4">
            <Dropdown label="Date Given" dropdownItems={["CSC 240"]} />

            <Dropdown label={"Submition Date"} dropdownItems={["Note"]} />
          </div>

          <button className="border p-3 border-dashed flex rounded justify-center items-center gap-5 border-[#0A32F8] text-[#0A32F8]">
            <PlusCircle color="#0A32F8" /> Files
          </button>
        </div>

        <div className="w-full">
          <CreatorFilesPreview />
        </div>

        <button className="flex sm:hidden justify-center items-center px-4 py-3 text-white bg-[#0A32F8] gap-3 rounded w-4/5 mx-auto my-4 ">
          <Upload size={15} /> Add Assignment
        </button>
      </section>
    </main>
  );
}
