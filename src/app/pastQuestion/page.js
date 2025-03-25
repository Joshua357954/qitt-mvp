"use client";
import React, { useState } from "react";
// import { Link, useLocation } from 'react-router-dom';
import PageNav from "../../components/PageNav.jsx";
import MainLayout from "../../components/MainLayout.jsx";
import { FaChevronRight as Arrow } from "react-icons/fa";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import {
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileWord,
} from "react-icons/ai";

const PastQuestion = ({ className }) => {
  const router = "useRouter()";
  // Access query parameters
  const queryParams = router.query;
  const dataParam = "practice";
  // queryParams.get('q');
  const [selection, setSelection] = useState(
    dataParam ? "practice" : "courses"
  );

  const [course, setCourse] = useState("csc280");
  const [time, setTime] = useState(10);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);

  const coursesi = [
    {
      title: "Introduction to Programming",
      documents: [
        { type: "PDF", icon: <AiOutlineFilePdf className="text-red-500" /> },
        { type: "Word", icon: <AiOutlineFileWord className="text-blue-500" /> },
      ],
    },
    {
      title: "Advanced Mathematics",
      documents: [
        {
          type: "Image",
          icon: <AiOutlineFileImage className="text-green-500" />,
        },
        { type: "PDF", icon: <AiOutlineFilePdf className="text-red-500" /> },
      ],
    },
    {
      title: "Data Structures and Algorithms",
      documents: [
        { type: "PDF", icon: <AiOutlineFilePdf className="text-red-500" /> },
        { type: "Word", icon: <AiOutlineFileWord className="text-blue-500" /> },
      ],
    },
  ];
  const cours = [0];

  return (
    <MainLayout route="Practice">
      <section className="w-full h-full overflow-y-auto">
        <div className="w-full h-20  mt-5 px-2 ">
          <div className="w-[70%] sm:w-[40%] bg-purple-50 h-[80%] px-[4px] rounded  py-1 ">
            <div className="flex items-center text-center rounded w-full  h-full ">
              <div
                onClick={() => setSelection("courses")}
                className={`w-[48%] rounded h-full text-lg sm:text-lg text-gray-900 flex items-center justify-center ${
                  selection == "courses" ? "font-bold bg-purple-400" : ""
                }`}
              >
                Study
              </div>
              <div className="w-2 bg-gray-200 h-full rounded"></div>
              <div
                onClick={() => setSelection("practice")}
                className={`w-[48%] rounded h-full text-lg sm:text-lg text-gray-900 flex items-center justify-center ${
                  selection == "practice" ? "font-bold bg-purple-400" : ""
                }`}
              >
                Practice
              </div>
            </div>
          </div>
        </div>

        {selection == "courses" ? (
          <section className="w-full pt-4 bg-gray-40 overflow-y-auto">
            {coursesi.map((course, idx) => (
              <div
                key={idx}
                className="pb-4 flex items-center gap-x-3 py-1 px-2"
              >
                <div className="w-2 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                  {/* Placeholder for course image/icon */}
                </div>
                <div className="flex flex-col">
                  <div className="font-bold">{course.title}</div>
                  <div className="font-light flex gap-x-2">
                    {course.documents.map((doc, docIdx) => (
                      <span key={docIdx} className="flex items-center gap-x-1">
                        {doc.icon}
                        {doc.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          ""
        )}

        {selection == "practice" ? (
          <section className="w-full pt-4 bg-gray-40 px-2 gap-y-4 flex flex-col items-center">
            <div className="flex gap-x-4">
              <span className="font-semibold">Time : </span>
              <select
                onChange={({ target }) => setTime(target.value)}
                className="bg-transparent flex focus:outline-none"
                name="api-verbs"
              >
                <option value={10}>10 mins</option>
                <option value={20}>20 mins</option>
                <option value={30}>30 mins</option>
                <option value={40}>40 mins</option>
                <option value={50}>50 mins</option>
                <option value={0}>No Time</option>
              </select>
            </div>

            <div className="flex gap-x-4">
              <span className="font-semibold">Course : </span>
              <select
                onChange={({ target }) => setCourse(target.value)}
                className="bg-transparent flex focus:outline-none"
                name="api-verbs"
              >
                <option value="csc280">CSC 280</option>
                <option value="ges101">GES 101</option>
              </select>
            </div>

            <div className="flex gap-x-4">
              <span className="font-semibold">No Of Questions : </span>
              <select
                onChange={({ target }) => setNumberOfQuestions(target.value)}
                className="bg-transparent flex focus:outline-none"
                name="api-verbs"
              >
                <option value={10}>10 </option>
                <option value={20}>20 </option>
                <option value={30}>30 </option>
                <option value={40}>40 </option>
                <option value={50}>50 </option>
                <option value={60}>60</option>
              </select>
            </div>

            <div className="w-full px-2 sm:w-[70%] flex justify-between items-center h-20 bg-gray-50 mt-8 rounded ">
              <Link
                href={`/pastQuestion/quizScreen?course=${course}&time=${time}&numberOfQuestions=${numberOfQuestions}`}
                
                className="h-[83%] text-lg gap-x-3 px-4 flex items-center font-semibold focus:text-white hover:text-gray-100 rounded text-white bg-gray-800"
              >
                Start <Arrow className="text-white" />{" "}
              </Link>
              <button className="bg-gray-200 px-4 h-[83%] rounded-md">
                {" "}
                <small className="bg-gray-00 p-0 text-gray-400 text-sm">
                  {" "}
                  Practice{"🪐"}
                </small>{" "}
                <p>With Friends</p>{" "}
              </button>
            </div>

            <Link
              href="/past_question_scoreboard"
              className="underline mt-6 text-slate-700 underline-offset-4"
            >
              <span className="text-2xl">🏆 </span>Check ScoreBoard
            </Link>
            {/* Rank Emojis | 🥇🔰🎖️ | Copy & Paste */}
          </section>
        ) : (
          ""
        )}
      </section>
    </MainLayout>
  );
};

export default PastQuestion;
