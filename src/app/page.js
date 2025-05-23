"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout.jsx";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link.js";
import AdBoard from "@/components/AdBoard.js";
import TimetableList from "@/components/MiniTimetable.js";
import Image from "next/image.js";
import useAuthStore from "./store/authStore.js";
import { listenToUserDepartmentSpace } from "@/libs/listener.js";
import SelectCourse from "@/components/SelectCourse.js";
import { useNotificationsSSE } from "@/hooks/useNotificationSSE.js";

const HomeScreen = () => {
  const { user: userData } = useAuthStore();
  useNotificationsSSE();
  // UseEffect To Fetch Timetable
  useEffect(() => {
    listenToUserDepartmentSpace(userData?.uid);
  }, []);

  const [course, setCourse] = useState();

  const adData = [
    { image: "/ad2.jpg", link: "/" },
    { image: "/ad2.jpg", link: "/" },
    { image: "/ad2.jpg", link: "/" },
    { image: "/ad2.jpg", link: "/" },
  ];

  const sections = [
    {
      title: "Department",
      icon: "/dept-2.png",
      image: "/q-blue-2.png",
      link: "/department",
      color: "bg-[#3759FF]",
    },
    {
      title: "Feedback",
      icon: "/feedback-2.png",
      image: "/q-yellow-2.png",
      link: "/feedback",
      color: "bg-[#F2C85C]",
    },
    {
      title: "Cgpa Calc.",
      icon: "/calculator.svg",
      image: "/q-green-2.png",
      link: "/cgpaCalculator",
      color: "bg-[#46D28F]",
    },
  ];

  const shadowStyle = {
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.15  )",
  };

  return (
    <MainLayout route="">
      {/* Properties Grid */}
      <section className="w-full h-full flex flex-col bg-gray-50  ">
        {/* inner Container*/}

        <div>
          {/* AD BOARD */}
          <div className="h-40 w-full">
            <AdBoard items={adData} />
          </div>

          {/* Quick Links */}
          <div className="w-full my-6 mb-7">
            {/* Large screens */}
            <div className="hidden sm:flex h-32 w-full justify-between bg-red-5500 mb-5 gap-10">
              {sections?.map((item, idx) => (
                <div
                  key={idx}
                  className={`${item?.color} w-1/3 rounded h-full relative`}
                >
                  <Link href={item?.link}>
                    <Image
                      src={item?.image}
                      width={40}
                      height={40}
                      alt="bg-image"
                      className="z-10 rounded h-full w-1/3 absolute right-0 top-0"
                      unoptimized
                    />
                    <div className="p-3">
                      <Image
                        src={item?.icon}
                        width={24}
                        height={20}
                        alt="icon"
                        className=""
                        unoptimized
                      />
                    </div>
                    <p className="text-right text-white mr-3 z-50 absolute right-0 bottom-4">
                      {item?.title}
                    </p>
                  </Link>
                </div>
              ))}
            </div>

            {/* Small screens */}
            <div className="flex sm:hidden w-full gap-4 justify-between">
              {sections?.map((item, idx) => (
                <div key={idx} className=" w-1/3 text-center">
                  <Link href={item?.link} className="w-full h-full">
                    <div
                      className={` h-[105px] rounded-full relative ${item.color}`}
                    >
                      <Image
                        src={item?.image}
                        width={40}
                        height={40}
                        alt="bg-image"
                        className="-z-10 rounded-full bg-cover w-full h-full"
                        unoptimized
                      />
                      <div className="w-full h-full bg-transparent absolute top-0 left-0 flex justify-center items-center rounded-full">
                        <Image
                          src={item?.icon}
                          width={40}
                          height={20}
                          alt="icon"
                          unoptimized
                        />
                      </div>
                    </div>
                  </Link>
                  <p className="text-center mt-[2px]">{item?.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* <SelectCourse handler={setCourse} /> */}
          {/* Timetable List */}
          <TimetableList />
        </div>
      </section>
      <Toaster />
    </MainLayout>
  );
};

export default HomeScreen;
