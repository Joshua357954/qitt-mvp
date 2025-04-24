"use client";
import { useState, useRef } from "react";
import MainLayout from "../../components/MainLayout.jsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import ClassTab from "./classlist";
import CoursesTab from "./course";
import AnnouncementSection from "./announcement";
import useAuthStore from "../store/authStore.js";
import {
  LayoutDashboard,
  Settings2,
  Megaphone,
  School,
  BookOpen,
} from "lucide-react";
import Link from "next/link.js";
import SpaceJoin from "./space.js";
import { hasAccess, RULES, useHasAccess } from "@/utils/useHasAccess.js";

const Department = () => {
  const { user: userData } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselApiRef = useRef(null);
  const sections = [
    {
      name: "Notice",
      icon: <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    { name: "Classes", icon: <School className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { name: "Courses", icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (carouselApiRef.current) {
      carouselApiRef.current.scrollTo(index);
    }
  };

  const space =
    userData?.department_space?.spaceId &&
    userData?.department_space?.status !== "pending";

  const manageSpace = useHasAccess(RULES.VIEW_MANAGE_SPACE);

  return (
    <MainLayout
      route={`${userData?.departmentId?.split("_").join(" ")}`}
      right={
        manageSpace && (
          <Link
            href="/space/manage-space"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings2 className="w-5 h-5 text-gray-600" size={25} />
          </Link>
        )
      }
    >
      {space ? (
        <section className="flex flex-col items-center h-full w-full">
          {/* Enhanced Tab Navigation with Lucide Icons */}
          <div className="w-full px-4  sm:px-6 ">
            <div className="flex justify-center sm:px-16  bg-transparent">
              <div className="relative w-full ">
                {/* Animated underline */}
                <div
                  className="absolute bottom-0 left-0 h-[3px] bg-blue-500 transition-all duration-300 rounded-full"
                  style={{
                    width: `${100 / sections.length}%`,
                    transform: `translateX(${activeIndex * 100}%)`,
                  }}
                />

                <div className="flex justify-between items-center  rounded-lg shadow-sm border border-gray-100 overflow-hidden w-full">
                  {sections.map((section, index) => (
                    <button
                      key={section.name}
                      onClick={() => handleTabClick(index)}
                      className={`flex-1 py-3 px-4 text-center font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2
                        ${
                          activeIndex === index
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <span
                        className={`transition-colors ${
                          activeIndex === index
                            ? "text-black animate-pulse"
                            : "text-gray-400"
                        }`}
                      >
                        {section.icon}
                      </span>
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Content */}
          <div className="w-full max-w-4xl mt-2 px-4 sm:px-6">
            <Carousel
              setApi={(api) => {
                carouselApiRef.current = api;
                api.on("select", () => {
                  setActiveIndex(api.selectedScrollSnap());
                });
              }}
              className="w-full"
              opts={{
                dragFree: true,
              }}
            >
              <CarouselContent>
                {sections.map((section, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4 sm:p-6">
                        {index === 0 && <AnnouncementSection />}
                        {index === 1 && <ClassTab />}
                        {index === 2 && <CoursesTab />}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      ) : userData?.department_space?.status !== "approved" ||
        userData?.department_space?.status !== "admin" ? (
        <SpaceJoin />
      ) : (
        <p>Loading</p>
      )}
    </MainLayout>
  );
};

export default Department;
