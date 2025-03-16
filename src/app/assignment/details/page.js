"use client";
import MainLayout from "@/components/MainLayout";
import { useSearchParams } from "next/navigation.js";
import { Suspense, useState, useEffect } from "react";
import PhotoGrid from "@/components/PhotoGrid";

const AssignmentDetails = () => {
  const searchParams = useSearchParams();

  const course = searchParams.get("course") || "No course provided";
  const dateGiven = searchParams.get("dateGiven") || "No date provided";
  const deadline = searchParams.get("deadline") || "No deadline provided";
  const content = searchParams.get("content") || "No content available";

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://picsum.photos/v2/list?page=1&limit=7"
        );
        const data = await response.json();
        setImages(
          data.map((img) => ({
            src: img.download_url,
            width: 400,
            height: 300,
          }))
        );
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <MainLayout route={course}>
      <div className="flex justify-center w-full flex-col h-[91%] sm:h-[87%] py-4">
        <div className="w-full sm:w-[60%] h-full px-2">
          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Course : </p>
            <h2 className="text-lg font-semibold text-gray-800">{course}</h2>
          </div>

          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Date Given : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {dateGiven.split(" ").slice(-2).join(" ")},{" "}
              {dateGiven.split(" ")[0]}
            </h2>
          </div>

          <div className="flex items-center gap-x-2 pt-3">
            <p className="font-light text-black"> Submission Date : </p>
            <h2 className="text-lg font-semibold text-gray-800">
              {deadline.split(" ").slice(-2).join(" ")},{" "}
              {deadline.split(" ")[0]}
            </h2>
          </div>
        </div>

        <div className="w-[98.5%] mx-auto my-5 bg-gray-300 h-[3px]"></div>
        <h1 className="text-[#0A32F8] ml-2 font-medium">Description :</h1>
        <p className="px-2 text-semibold mt-3">{content}</p>
        <div className="ml-2 w-2/3 sm:w-1/2">
          <PhotoGrid />
        </div> 
      </div>
      {/* Photo Grid */}
    </MainLayout>
  );
};

export default AssignmentDetails;
