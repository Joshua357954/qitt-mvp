"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout.jsx";

const ResourceTypesLoadingSkeleton = () => {
  return (
    <MainLayout route="Resource Types">
      <div className="px-4 sm:px-6 py-4 mx-auto">
        {/* Header Loading */}
        <div className="mb-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Type Filters Loading */}
        <div className="mb-6 overflow-x-auto pb-2 animate-pulse">
          <div className="flex gap-2 w-max">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-8 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
        </div>

        {/* Resource Type Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-4 h-full animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Resources List Loading */}
        <div className="mt-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const ResourceTypesSkeleton = () => {
  const [activeType, setActiveType] = useState("all");
  
  // Mock data for resource types
  const resourceTypes = [
    { type: "note", count: 124, description: "Lecture notes and summaries" },
    { type: "past question", count: 89, description: "Previous exam questions" },
    { type: "study guide", count: 42, description: "Study materials and guides" },
    { type: "other", count: 15, description: "Miscellaneous resources" },
  ];

  const typeColors = {
    note: "bg-green-500",
    "past question": "bg-blue-500",
    'study guide': "bg-purple-500",
    other: "bg-gray-500",
  };

  return (
    <MainLayout route="Resource Types">
      <div className="px-4 sm:px-6 py-4 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Resource Types</h1>
          <p className="text-gray-600 mt-2">
            Browse resources by category and access relevant materials
          </p>
        </div>

        {/* Type Filters */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 w-max">
            <Button
              variant={activeType === "all" ? "default" : "outline"}
              onClick={() => setActiveType("all")}
              className="whitespace-nowrap text-sm px-3 py-1 h-8"
            >
              All Resources
            </Button>
            {resourceTypes.map(({ type, count }) => (
              <Button
                key={type}
                variant={activeType === type ? "default" : "outline"}
                onClick={() => setActiveType(type)}
                className="whitespace-nowrap text-sm px-3 py-1 h-8"
              >
                {type} ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* Resource Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceTypes.map(({ type, count, description }) => (
            <Card 
              key={type} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeType === type ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveType(type)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg capitalize">
                    {type}
                  </CardTitle>
                  <Badge
                    className={`${
                      typeColors[type] || "bg-gray-500"
                    } text-white`}
                  >
                    {count}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resources List (would be filtered by activeType) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {activeType === "all" ? "All Resources" : `${activeType}s`}
          </h2>
          {/* You would render filtered resources here */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Resources of type "{activeType}" would appear here
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResourceTypesSkeleton;