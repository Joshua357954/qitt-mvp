"use client";
import { useEffect, useState } from "react";
import PageNav from "../../components/PageNav.jsx";
import MainLayout from "../../components/MainLayout.jsx";
import { BsChevronLeft as Arrow } from "react-icons/bs";
import {
  baseUrl,
  formatCode,
  formatTime,
  getCurrentDay,
} from "../../utils/utils.js";
import { FaChevronRight as AR, FaChevronLeft as AL } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image.js";
import useTimetableStore from "../store/timetableStore.js";

const TimetableScreen = ({ className }) => {
  const currentDay = getCurrentDay();
  const [day, setDay] = useState(currentDay);
  const [isExam, setIsExam] = useState(false);
  const { timetable, isLoading, fetchTimetable } = useTimetableStore();
  const [daysClases, setDaysClasses] = useState([]);

  const examTB = [
    {
      monday: [
        { date: "4th", time: "9am - 12pm", course: "STA 160" },
        { date: "4th", time: "9am - 12pm", course: "STA 160" },
      ],
    },
    { tuesday: [{ date: "6th", time: "9am - 12pm", course: "GES 102" }] },
  ];

  const courses = [
    {
      time: "8:00am - 10:00am",
      color: "bg-red-300",
      course: "CHEM 132",
      venue: "MBA 2",
    },
    {
      time: "1:00pm - 3:00pm ",
      color: "bg-orange-300",
      course: "MATH 125",
      venue: "FOS ",
    },
    {
      time: "3:00pm - 4:00pm",
      color: "bg-yellow-400",
      course: "STA 116",
      venue: "MBA 1",
    },
    {
      time: "4:00pm - 6:00pm",
      color: "bg-green-400",
      course: "CSC 132",
      venue: "NSA",
    },
  ];

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  return (
    <MainLayout route="Timetable">
      <div className="w-full h-[96%] flex flex-col justify-center">
        {/*
			<div onClick={() => setIsExam(!isExam)} className="bg-white text-sm md:text-md font-bold px-2 py-3 flex items-center gap-2 rounded-md text-black">
			{isExam ? <AL className="font-extrabold"/> : "" } {!isExam ? 'Exam' : 'Lecture'} {!isExam ? <AR className="font-extrabold"/>: ""} 
			</div>
			*/}

        <div className="w-full transition-all ease-in-out h-full flex flex-col items-center pt-5">
          {isExam && (
            <div className="mx-auto flex items-center gap-4 text-sm mb-4 bg-black text-white p-2 rounded font-bold">
              <p className="bg-white text-black px-2 py-1">Week 1</p>
              <p>Week 2</p>
            </div>
          )}

          <div className="w-full justify-start sm:justify-center border rounded-sm border-gray-500 flex overflow-x-auto h-20 gap-20 sm:gap-6 mb-5 p-3">
            {days.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setDay(item)}
                className={`capitalize flex text-gray-500 select-none justify-center px-4 font-bold text-sm items-center ${
                  item === day
                    ? "bg-[#5773FF]   text-white border-[0px] border-black"
                    : "bg-blue-5"
                } rounded `}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="px-2 flex flex-wrap justify-center gap-5 items-center w-full">
            {timetable && timetable.length > 0 ? (
              timetable.map((dayItem, dayIdx) => {
                const currentDay = Object.keys(dayItem)[0];
                const dayClasses = Object.values(dayItem);

                if (currentDay.toLowerCase() === day.toLowerCase()) {
                  return dayClasses.map((classItem, classIdx) =>
                    classItem.map((item, idx) => (
                      //   <div
                      //     key={idx}
                      //     className="flex w-full sm:w-[70%] mt-2 justify-between bg-gray-100 py-1 px-2"
                      //   >
                      //     <p className="w-[24%]">{formatTime(item.time)}</p>
                      //     <span
                      //       className={`bg-slate-700 rounded h-22 w-[5px]`}
                      //     ></span>
                      //     <div className="flex flex-col w-[40%]">
                      //       <p className="font-bold">{formatCode(item.course)}</p>
                      //       <p className="font-light truncate">{item.venue}</p>
                      //     </div>
                      //   </div>
                      <div
                        className="p-4 border items-center rounded-sm min-w-40  border-gray-300 flex flex-col gap-1"
                        key={idx}
                      >
                        <Image
                          src="/t-book.png"
                          alt="book-icon"
                          width={25}
                          height={25}
                        />
                        <p className="font-bold">{formatCode(item.course)}</p>
                        <p className="text-[#5773FF] text-sm font-semibold">
                          {formatTime(item.time)}
                        </p>
                        <p>{item.venue}</p>
                      </div>
                    ))
                  );
                }
                return null;
              })
            ) : (
              <div className="w-full text-center mt-4 text-gray-600">
                📅 No timetable entries found. Feel free to <br />
                <a
                  href="https://api.whatsapp.com/send?phone=+2349034954069&text=Hi,%20please,%20I%20want%20to%20add/update%20my%20timetable."
                  target="_blank"
                  className="text-blue-500"
                >
                  Click here to update your timetable on WhatsApp 🚀
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// const carousel = document.querySelector('.carousel');
// const container = document.querySelector('.carousel-container');
// const slides = document.querySelectorAll('.carousel-slide');

// let startX, isDragging = false, currentIndex = 0, translateX = 0;

// carousel.addEventListener('touchstart', (e) => (isDragging = true, startX = e.touches[0].clientX));
// carousel.addEventListener('touchmove', (e) => isDragging && (translateX += e.touches[0].clientX - startX, container.style.transform = `translateX(${translateX}px)`, startX = e.touches[0].clientX));
// carousel.addEventListener('touchend', () => {
//     if (!isDragging) return;
//     isDragging = false;
//     const threshold = 100, slideWidth = slides[0].offsetWidth;
//     currentIndex += (translateX / slideWidth > 0.5) ? -1 : (translateX / slideWidth < -0.5) ? 1 : 0;
//     currentIndex = Math.min(Math.max(currentIndex, 0), slides.length - 1);
//     translateX = -currentIndex * slideWidth;
//     container.style.transform = `translateX(${translateX}px)`;
// });

// window.addEventListener('resize', () => (translateX = -currentIndex * slides[0].offsetWidth, container.style.transform = `translateX(${translateX}px)`));

export default TimetableScreen;
