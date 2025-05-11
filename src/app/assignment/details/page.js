"use client";
import MainLayout from "@/components/MainLayout";
import { useSearchParams } from "next/navigation.js";
import { Suspense, useState, useEffect } from "react";
import FileGrid from "@/components/FileGrid";
import useDepartmentStore from "@/app/store/departmentStore";

const AssignmentDetails = () => {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("id") || "No assignment ID provided";

  const [assignment, setAssignment] = useState({});
  const [loading, setLoading] = useState(true);
  const { getItem } = useDepartmentStore();

  useEffect(() => {
    const findOne = async () => {
      setLoading(true);
      const found = await getItem("assignments", assignmentId);
      setAssignment(found);
      setLoading(false);
      console.log("Found : ", found);
    };
    if (assignmentId) {
      findOne();
    }
  }, [assignmentId]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or skeleton loader
  }

  return (
    <MainLayout route={assignment?.course + " Assignment Detail"}>
      <div className="flex justify-center w-full flex-col h-[91%] sm:h-[87%] py-4">
        <div className="w-full sm:w-[60%] h-full px-2">
          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Course : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {assignment?.course}
            </h2>
          </div>

          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Date Given : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {assignment?.dateGiven}
            </h2>
          </div>

          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Submission Date : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {assignment?.dueDate}
            </h2>
          </div>
        </div>

        <div className="w-[98.5%] mx-auto my-5 bg-gray-300 h-[3px]"></div>
        <h1 className="text-[#0A32F8] ml-2 font-medium">Description :</h1>
        <p className="px-2 text-semibold mt-3">{assignment?.description}</p>
        <div className="ml-2 w-2/3 sm:w-1/2">
          {/* Photo Grid */}
          <FileGrid files={assignment.files} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AssignmentDetails;
