"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout.jsx";

import {
  baseUrl,
  formatCode,
  formatTime,
  formatTimetableEntry,
  getCurrentDay,
} from "../utils/utils.js";
import {
  FaUserFriends as Friends,
  FaFacebookMessenger as Message,
} from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTimetable } from "../libs/features/userSlice.js";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link.js";

import AdBoard from "@/components/AdBoard.js";
import TimetableList from "@/components/MiniTimetable.js";
import Image from "next/image.js";
import useAuthStore from "./store/authStore.js";
import useTimetableStore from "./store/timetableStore.js";

const HomeScreen = () => {
  const { user: userData } = useAuthStore();
  const { timetable, isLoading, fetchTimetable } = useTimetableStore();

  const department = userData?.department;

  const year = userData?.level ? String(userData.level)[0] : undefined;

  const currentDay = getCurrentDay();

  const currentDateTime = new Date();

  const currentTime =
    currentDateTime?.getHours() * 100 + currentDateTime?.getMinutes(); // Convert current time to a numeric

  // UseEffect To Fetch Timetable
  useEffect(() => {
    fetchTimetable('computer_science',2);
  }, []);

  const timetableData = (timetable) => {
    if (!Array.isArray(timetable) || timetable.length === 0) return []; // Handle edge cases

    const currentDayKey = currentDay.toUpperCase();
    const foundDay = timetable.find(
      (item) => Object.keys(item)[0].toLowerCase() === currentDay
    );
    return foundDay ? foundDay[currentDayKey] || [] : [];
  };

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
      title: "Practice",
      icon: "/practice-2.png",
      image: "/q-green-2.png",
      link: "/practice",
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
          <div className="h-32 w-full py-2 mt-6 flex gap-10">
            {sections?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`${item?.color} w-1/3 rounded h-full relative`}
                >
                  <Image
                    src={item?.image}
                    width={40}
                    height={40}
                    alt="bg-image"
                    className="z-10 rounded 
                h-full w-1/3 absolute right-0 top-0"
                    unoptimized
                  />
                  <div className="p-3">
                    <Image
                      src={item?.icon}
                      width={24}
                      height={20}
                      alt="icon"
                      className=""
                    />
                  </div>
                  <p className="text-right text-white mr-3 z-50 absolute right-0 bottom-4">
                    {item?.title}
                  </p>
                </div>
              );
            })}
          </div>

          <h2 className="font-semibold text-xl mt-6 mb-1">
            Today's Classes
            {timetableData(timetable).length > 0 && (
              <span className="bg-blue-500 text-sm text-white rounded-full ml-3 px-2 py-1">
                {timetableData(timetable).length}
              </span>
            )}
          </h2>

          {/* Timetable List */}
          <TimetableList
            timetable={timetable}
            timetableData={timetableData}
            currentTime={currentTime}
          />
        </div>
      </section>
      <Toaster />
    </MainLayout>
  );
};

export default HomeScreen;
