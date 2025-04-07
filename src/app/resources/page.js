"use client";
import React, { useState } from "react";
import {
  PiEye,
  PiFiles as PQ,
  PiPencilLine as Assign,
  PiCalendar,
  PiUser,
  PiCaretDown,
  PiFiles,
} from "react-icons/pi";
import MainLayout from "../../components/MainLayout.jsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

// Enhanced dummy data
const resourcesData = [
  {
    category: "all",
    label: "All Resources",
    icon: <PiFiles className="mr-2 h-4 w-4" />,
    items: [],
  },
  {
    category: "notes",
    label: "Study Notes",
    icon: <Assign className="mr-2 h-4 w-4" />,
    items: [
      {
        id: 1,
        title: "Calculus Basics",
        description: "Essential formulas and concepts for Calculus.",
        link: "#",
        type: "note",
        author: "Mathematics Dept",
        date: "2024-03-15",
      },
      {
        id: 2,
        title: "Linear Algebra",
        description: "Matrix operations and vector spaces.",
        link: "#",
        type: "note",
        author: "Prof. Johnson",
        date: "2024-02-28",
      },
      {
        id: 3,
        title: "Organic Chemistry",
        description: "Reaction mechanisms and functional groups.",
        link: "#",
        type: "note",
        author: "Dr. Smith",
        date: "2024-01-10",
      },
      {
        id: 4,
        title: "Cell Biology",
        description: "Cell structure and functions study guide.",
        link: "#",
        type: "note",
        author: "Bio Faculty",
        date: "2023-12-05",
      },
    ],
  },
  {
    category: "past questions",
    label: "Past Exams",
    icon: <PQ className="mr-2 h-4 w-4" />,
    items: [
      {
        id: 5,
        title: "Physics 2020-23",
        description: "Complete past questions collection.",
        link: "#",
        type: "past question",
        author: "Exam Committee",
        date: "2023-11-10",
      },
      {
        id: 6,
        title: "Chemistry Finals",
        description: "Previous year question papers.",
        link: "#",
        type: "past question",
        author: "Chemistry Dept",
        date: "2023-10-22",
      },
    ],
  },
  {
    category: "guides",
    label: "Study Guides",
    icon: <PiFiles className="mr-2 h-4 w-4" />,
    items: [
      {
        id: 7,
        title: "Research Methods",
        description: "Step-by-step academic research guide.",
        link: "#",
        type: "guide",
        author: "Library Staff",
        date: "2024-01-15",
      },
      {
        id: 8,
        title: "Thesis Writing",
        description: "Structure and formatting guidelines.",
        link: "#",
        type: "guide",
        author: "Grad School",
        date: "2023-09-30",
      },
    ],
  },
];

const typeColors = {
  note: "bg-green-500",
  "past question": "bg-blue-500",
  guide: "bg-purple-500",
  other: "bg-gray-500",
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const ResourcesCard = ({ resource }) => {
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">
            {resource.title}
          </CardTitle>
          <Badge className={`${typeColors[resource.type]} text-white shrink-0`}>
            {resource.type}
          </Badge>
        </div>
        <CardDescription className="mt-1 line-clamp-2 text-sm">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <PiUser className="h-3 w-3" />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <PiCalendar className="h-3 w-3" />
            <span>{formatDate(resource.date)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Button variant="outline" size="sm" asChild className="h-8">
          <a href={resource.link} className="flex items-center gap-1">
            <PiEye className="h-3 w-3" />
            <span className="text-xs">View</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Resources = () => {
  const [resourceName, setResource] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");

  const filteredResources = () => {
    let items =
      resourceName === "all"
        ? resourcesData.flatMap((category) => category.items)
        : resourcesData.find((category) => category.category === resourceName)
            ?.items || [];

    // Sorting logic
    if (selectedSort === "recent") {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedSort === "oldest") {
      items.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (selectedSort === "name") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    }

    return items;
  };

  return (
    <MainLayout route="Resources">
      <section className="flex flex-col gap-4 w-full h-full p-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Category Carousel with Navigation */}
          <div className="w-full relative">
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-1">
                {resourcesData.map((item, index) => (
                  <CarouselItem key={index} className="pl-1 basis-auto">
                    <Button
                      variant={
                        resourceName === item.category ? "default" : "outline"
                      }
                      onClick={() => setResource(item.category)}
                      className="whitespace-nowrap px-3 text-xs sm:text-sm h-8"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex h-8 w-8" />
              <CarouselNext className="hidden sm:flex h-8 w-8" />
            </Carousel>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-32 h-8 text-xs sm:text-sm gap-1"
              >
                Sort by
                {/* <PiCaretDown className="h-3 w-3" /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem
                onClick={() => setSelectedSort("recent")}
                className={selectedSort === "recent" ? "bg-gray-100" : ""}
              >
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedSort("oldest")}
                className={selectedSort === "oldest" ? "bg-gray-100" : ""}
              >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedSort("name")}
                className={selectedSort === "name" ? "bg-gray-100" : ""}
              >
                By Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Resources Grid */}
        <div className="w-full gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredResources().length > 0 ? (
            filteredResources().map((resource) => (
              <ResourcesCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="flex items-center justify-center col-span-full py-8">
              <Card className="text-center p-4 max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-sm">No Resources Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-xs">
                    No resources match your selected filters.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Resources;
