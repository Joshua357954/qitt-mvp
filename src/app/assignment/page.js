"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout.jsx";
import AssignmentCard from "@/components/AssignmentItem.js";
import { ArrowRight, FileSearch, Sparkles } from "lucide-react";
import useDepartmentStore from "../store/departmentStore.js";

/* ➡️ Categorize and sort assignments by course and date */
const categorizeAndSortAssignments = (assignments) => {
  return assignments.reduce((acc, item) => {
    acc[item.course] = (acc[item.course] || [])
      .concat(item)
      .sort((a, b) => new Date(a.dateGiven) - new Date(b.dateGiven));
    return acc;
  }, {});
};

const AssignmentCardSkeleton = () => {
  return (
    <div className="w-full sm:w-[70%] mx-auto mb-2 bg-white min-h-32 flex items-center rounded p-5 border border-gray-400 animate-pulse">
      {/* Left Side - Image Skeleton */}
      <div className="w-[25%] h-32 bg-gray-200 flex justify-center items-center rounded-sm">
        {/* <div className="w-14 h-14 bg-gray-300 rounded-full"></div> */}
      </div>

      {/* Right Side - Content Skeleton */}
      <div className="w-[65%] h-full flex flex-col px-3 pt-2 gap-y-3">
        {/* Course Category Skeleton */}
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>

        {/* Assignment Count Skeleton */}
        <div className="flex items-center gap-x-2">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Assignment Links Skeleton */}
        <div className="flex gap-2 flex-wrap">
          {[1, 2].map((_, id) => (
            <div
              key={id}
              className="h-7 w-16 bg-gray-200 rounded flex items-center justify-center"
            >
              <ArrowRight size={9} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ➡️ Loading Skeleton */
const SkeletonLoader = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((_, idx) => (
      <AssignmentCardSkeleton />
    ))}
  </div>
);

/* ➡️ Main Component */
const AssignmentScreen = () => {
  const { assignments, loading, fetchAssignments } = useDepartmentStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await fetchAssignments(); // Call fetchAssignments from the Zustand store
        console.log("✅ Assignment data fetched: ", assignments);
      } catch (error) {
        console.error("❌ Error fetching assignments: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!assignments?.length) {
      fetchData();
    } else {
      setIsLoading(false); // If data already exists, stop loading
    }
  }, [fetchAssignments]);

  const categorizedAssignments = categorizeAndSortAssignments(assignments);

  return (
    <MainLayout route="Assignment">
      <div className="w-full pt-3 min-h-full overflow-y-auto">
        {loading || isLoading ? (
            <SkeletonLoader/>
        ) : !assignments?.length ? (
          <div className="w-full text-center my-8">
            <div className="inline-flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <FileSearch className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No assignments found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                When new assignments are created, they'll appear here
              </p>
            </div>
          </div>
        ) : (
          Object.entries(categorizedAssignments).map(
            ([course, assignments], idx) => (
              <AssignmentCard
                key={idx}
                item={assignments}
                idx={idx}
                courseCategory={course}
              />
            )
          )
        )}
      </div>
    </MainLayout>
  );
};

export default AssignmentScreen;
