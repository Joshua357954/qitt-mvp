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
} from "lucide-react/dist/cjs/lucide-react.js";
import Link from "next/link.js";
import SpaceJoin from "./space.js";
import { hasAccess, RULES, useHasAccess } from "@/utils/hasAccess.js";

const Department = () => {
  const { user: userData } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselApiRef = useRef(null);
  const sections = ["Notice📢", "class", "courses"];

  const handleTabClick = (index) => {
    if (carouselApiRef.current) {
      carouselApiRef.current.scrollTo(index); // Scroll to the selected tab
    }
  };

  const space =
    userData?.department_space?.spaceId &&
    userData?.department_space?.status !== "pending";
  
  const manageSpace = useHasAccess(RULES.VIEW_MANAGE_SPACE)

  return (
    <MainLayout
      route={`${userData?.departmentId?.split("_").join(" ")}`}
      right={
        manageSpace && (
          <Link href="/space/manage-space">
            <Settings2 className="w-5 h-5 text-black" size={25} />
          </Link>
        )
      }
    >
      {/* {console.log('Has Access :',hasAccess(userData?.department_space))} */}
      {/* {JSON.stringify(userData?.department_space)} */}
      {space ? (
        <section className="flex flex-col items-center w-full">
          {/* Tab Navigation */}
          <div className="w-full h-14 max-h-14 flex justify-center items-center mt-2">
            <div className="w-[96%] sm:w-[80%] h-full py-1 bg-blue-50 flex justify-between items-center px-2 rounded text-center">
              {sections.map((section, index) => (
                <div
                  key={section}
                  onClick={() => handleTabClick(index)}
                  className={`w-[33%] text-sm flex justify-center items-center px-2 text-black ${
                    activeIndex === index
                      ? "bg-blue-700 font-extrabold text-white"
                      : ""
                  } h-full rounded cursor-pointer transition-colors duration-200`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Content */}
          <div className="w-[96%] sm:w-[80%] mt-4">
            <Carousel
              setApi={(api) => {
                carouselApiRef.current = api;
                // Sync with default active index on mount
                api.on("select", () => {
                  setActiveIndex(api.selectedScrollSnap());
                });
              }}
              className="w-full"
            >
              <CarouselContent>
                <CarouselItem>
                  <Card>
                    <CardContent className="p-0">
                      <AnnouncementSection />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardContent className="p-0">
                      <ClassTab />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardContent className="p-0">
                      <CoursesTab />
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      ) : (
        <SpaceJoin />
      )}
    </MainLayout>
  );
};

export default Department;
