"use client";
import MainLayout from "@/components/MainLayout";
import { useSearchParams } from "next/navigation.js";
import { Suspense, useState, useEffect } from "react";
import FileGrid from "@/components/FileGrid";
import useDepartmentStore from "@/app/store/departmentStore";
import { fbTime } from "@/utils/utils";

const ResourceDetails = () => {
  const searchParams = useSearchParams();
  const resourceId = searchParams.get("id") || "No resource ID provided";

  const [resource, setResource] = useState({});
  const [loading, setLoading] = useState(true);
  const { getItem } = useDepartmentStore();

  useEffect(() => {
    const findOne = async () => {
      setLoading(true);
      const found = await getItem("resources", resourceId);
      setResource(found);
      setLoading(false);
      console.log("Found : ", found);
    };
    if (resourceId) {
      findOne();
    }
  }, [resourceId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout route={resource?.course}>
      <div className="flex justify-center w-full flex-col h-[91%] sm:h-[87%] py-4">
        <div className="w-full sm:w-[60%] h-full px-2">
          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Title : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {resource?.title}
            </h2>
          </div>

          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Author : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {resource?.postedBy.name}
            </h2>
          </div>

          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Updated : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {new Date(fbTime(resource?.updatedAt)).toLocaleDateString()}
            </h2>
          </div>
        </div>

        <div className="w-[98.5%] mx-auto my-5 bg-gray-300 h-[3px]"></div>
        <h1 className="text-[#0A32F8] ml-2 font-medium">Description :</h1>
        <p className="px-2 text-semibold mt-3">{resource?.description}</p>
        <div className="ml-2 w-2/3 sm:w-1/2">
          {/* File Grid */}
          <FileGrid files={resource.files} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ResourceDetails;
