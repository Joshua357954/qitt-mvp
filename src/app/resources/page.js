"use client";
import React, { useEffect, useState } from "react";
import {
  PiEye,
  PiCalendar,
  PiUser,
} from "react-icons/pi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDepartmentStore from "@/app/store/departmentStore.js";
import MainLayout from "@/components/MainLayout.jsx";
import { fbTime, fDate } from "@/utils/utils";

const typeColors = {
  note: "bg-green-500",
  "past question": "bg-blue-500",
  'study guide': "bg-purple-500",
  other: "bg-gray-500",
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const ResourcesCard = ({ resource }) => {
  const fileUrl =
    typeof resource.files[0] === "string"
      ? resource.files[0]
      : resource.files[0]?.url ?? "#";

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col border border-gray-200 rounded-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1 font-medium capitalize">
            {resource.title}
          </CardTitle>
          <Badge
            className={`${
              typeColors[resource?.type] || "bg-gray-500"
            } text-white shrink-0 text-xs`}
          >
            {resource.type}
          </Badge>
        </div>
        <CardDescription className="mt-1 line-clamp-2 text-sm text-gray-600">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <PiUser className="h-3 w-3" />
            <span>{resource?.postedBy.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <PiCalendar className="h-3 w-3" />
            <span>{new Date(fbTime(resource?.updatedAt)).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Button variant="outline" size="sm" asChild className="h-8">
          <a 
            href={`/resources/details?id=${resource?.id}`} 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-sm"
          >
            <PiEye className="h-3 w-3" />
            <span>View</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const LoadingCard = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col animate-pulse w-full mx-auto">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
};

const Resources = () => {
  const { resources, loading, fetchResources } = useDepartmentStore();
  const [resourceName, setResource] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchResources();
      } catch (error) {
        console.error("❌ Error fetching resources: ", error);
      }
    };

    fetchData();
  }, [fetchResources]);

  // Extract categories and courses for filtering
  const categories = Array.from(new Set(resources?.map((r) => r.type) || []));
  const courses = Array.from(new Set(resources?.map((r) => r.course) || []));

  return (
    <MainLayout route="Resources">
      <div className="px-4 sm:px-6 py-4 ">
        {/* Category Filters */}
        <div className="mb-4 overflow-x-auto pb-2">
          <div className="flex gap-2 w-max">
            <Button
              variant={resourceName === "all" ? "default" : "outline"}
              onClick={() => setResource("all")}
              className="whitespace-nowrap text-sm px-3 py-1 h-8"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={resourceName === category ? "default" : "outline"}
                onClick={() => setResource(category)}
                className="whitespace-nowrap text-sm px-3 py-1 h-8"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Dropdown */}
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-48 h-9 text-sm"
              >
                {selectedCourse || "Filter by Course"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
              <DropdownMenuItem 
                onClick={() => setSelectedCourse("")}
                className="text-sm"
              >
                All Courses
              </DropdownMenuItem>
              {courses?.map((course) => (
                <DropdownMenuItem
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className="text-sm"
                >
                  {course}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : resources?.filter(
              (resource) =>
                (resourceName === "all" || resource.type === resourceName) &&
                (selectedCourse === "" || resource.course === selectedCourse)
            ).length > 0 ? (
            resources
              .filter(
                (resource) =>
                  (resourceName === "all" || resource.type === resourceName) &&
                  (selectedCourse === "" || resource.course === selectedCourse)
              )
              .map((resource) => (
                <ResourcesCard key={resource._id || resource.title} resource={resource} />
              ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No resources found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;