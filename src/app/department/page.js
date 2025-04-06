"use client";
import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout.jsx";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addCoursemates } from "../../libs/features/userSlice.js";
import Link from "next/link.js";
import useAuthStore from "../store/authStore.js";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const NameInitial = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "";

  return (
    <div className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white font-bold rounded-full">
      {initial}
    </div>
  );
};

const Department = ({ className }) => {
  const dispatch = useDispatch();
  const { user: userData } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(1); // Start with Class tab (index 1)
  const { courseName } = useSelector((state) => state.user);
  const { coursemates } = useSelector((state) => state.users);
  const dept = userData?.department;

  const courses = [
    { name: "MTH270.1", description: "Numerical analysis" },
    { name: "MTH210.1", description: "Linear Algebra" },
    {
      name: "STA260.1",
      description: "Introduction to probability and statistics",
    },
    {
      name: "CSC280.1",
      description: "Introduction to Computer programming (Fortran)",
    },
    { name: "CSC281.1", description: "Computer system fundamentals" },
    {
      name: "CSC283.1",
      description: "Introduction to information systems and File structures",
    },
    { name: "CSC284.1", description: "Introduction to Logic Design" },
    { name: "CSC288.1", description: "Structured programming" },
  ]; //
  // : dept === "mechanical_engineering"
  // ? [
  //     {
  //       name: "MEC101.1",
  //       description: "Introduction to Mechanical Engineering",
  //     },
  //     { name: "MEC201.1", description: "Engineering Thermodynamics I" },
  //     { name: "MEC202.1", description: "Strength of Materials" },
  //     { name: "MEC203.1", description: "Fluid Mechanics I" },
  //     { name: "MEC204.1", description: "Engineering Mechanics" },
  //     { name: "MEC205.1", description: "Mechanical Engineering Drawing" },
  //     { name: "MEC301.1", description: "Manufacturing Processes I" },
  //     { name: "MEC302.1", description: "Machine Design I" },
  //   ]
  // : [];

  const sections = ["announcement", "class", "courses"];

  useEffect(() => {
    const getUsersByDepartment = async (department) => {
      try {
        const response = await Axios.get(
          `/api/user/qitt?department=${"computer_science"}`
        );
        const users = response.data;
        dispatch(addCoursemates(users));
      } catch (error) {
        console.error("Error fetching users:", error?.message);
      }
    };
    getUsersByDepartment(userData?.department);
  }, [activeIndex === 1, coursemates == []]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <MainLayout route={`${userData?.department?.split("_").join(" ")}`}>
      <section className="flex flex-col items-center w-full">
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

        <div className="w-[96%] sm:w-[80%] mt-4">
          <Carousel
            opts={{
              startIndex: activeIndex,
              active: true,
              onSelect: (api) => setActiveIndex(api.selectedScrollSnap()),
            }}
            className="w-full"
          >
            <CarouselContent>
              {/* Announcement Tab */}
              <CarouselItem>
                <Card>
                  <CardContent className="p-4">
                    <div className="py-6">
                      <p className="mb-2 text-lg font-semibold text-gray-800">
                        Announcements will appear here.
                      </p>
                      <p className="mb-4 text-lg text-gray-700">
                        Check back later for important updates from your
                        department.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Class Tab */}
              <CarouselItem>
                <Card>
                  <CardContent className="p-4">
                    <div className="w-full h-full pt-1 overscroll-y-auto">
                      {coursemates &&
                        coursemates?.map((item, idx) => (
                          <div
                            key={idx}
                            className="pb-2 flex items-center gap-x-4 px-2 pl-4"
                          >
                            <NameInitial name={item.name} />
                            <div className="flex flex-col">
                              <div className="font-bold">{item.name}</div>
                            </div>
                          </div>
                        ))}

                      <div className="py-10">
                        <p className="mb-2 text-lg font-semibold text-gray-800">
                          Ensure the class list is complete by inviting your
                          course mates to join.
                        </p>
                        <p className="mb-4 text-lg text-gray-700">
                          Alternatively, you can also{" "}
                          <a
                            href="https://api.whatsapp.com/send?text=📚 Stay%20up%20to%20date%20with%20school%20activities%20by%20joining%20Qitt%20at%20https://qitt.com.ng"
                            target="_blank"
                            className="text-blue-500"
                          >
                            send a WhatsApp message
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Courses Tab */}
              <CarouselItem>
                <Card>
                  <CardContent className="p-4">
                    <div className="pt-5 pl-1 w-full">
                      {courses.length > 0 ? (
                        courses.map((item, idx) => (
                          <div
                            key={idx}
                            className="mb-3 border-l-[4px] border-gray-500 hover:bg-gray-50 pl-3 py-2 flex items-center gap-y-4"
                          >
                            <div className="flex flex-col">
                              <div className="font-black text-lg">
                                {item?.name}
                              </div>
                              <div className="font-light">
                                {item?.description}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6">
                          <p className="mb-2 text-lg font-semibold text-gray-800">
                            Oops! No courses or outlines available at the
                            moment.
                          </p>
                          <p className="mb-4 text-lg text-gray-700">
                            Alternatively, you can also{" "}
                            <a
                              href="https://api.whatsapp.com/send?text=📚 Stay%20up%20to%20date%20with%20school%20activities%20by%20joining%20Qitt%20at%20https://qitt.com.ng"
                              target="_blank"
                              className="text-blue-500"
                            >
                              Let Us Know
                            </a>
                            .
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </MainLayout>
  );
};
export default Department;
