"use client";
import React, { useState } from "react";
// import { Link, useLocation } from 'react-router-dom';
import PageNav from "../../components/PageNav.jsx";
import MainLayout from "../../components/MainLayout.jsx";
import { FaChevronRight as Arrow, FaTrophy } from "react-icons/fa";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import {
  AiOutlineFileImage,
  AiOutlineFilePdf,
  AiOutlineFileWord,
} from "react-icons/ai";
import { ImHappy } from "react-icons/im";

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

  const cours = [0];

  return (
    <MainLayout route="Practice">
      <section className="w-full pt-4 bg-gray-40 px-2 gap-y-4 flex flex-col items-center">
        {/* <h1 className="text-left font-bold text-3xl underline underline-offset-4 mb-4 flex items-center gap-4">
          Let's Have Fun <ImHappy className="text-yellow-1000" />
        </h1> */}
        <div className="w-full  h-24 bg-blue-700 text-white px-6 py-4 rounded-sm flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <FaTrophy size={32} />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-md "> Practice like a Pro</p>
              <p className="font- text-sm sm:w-full">
                {" "}
                Level up your grades in school{" "}
                <Link href={"#"} className="underline sm:hidden text-gray-300">
                  ScoreBoard 🎖️
                </Link>
              </p>
            </div>
          </div>
          <button className="bg-white text-blue-700 hidden h-10 items-center sm:flex px-4 rounded-full justify-center font-semibold w-34">
            Board 🎖️
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
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
          <div className="flex gap-x-4 my-1">
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
        </div>

        <div className="w-full px-2 sm:w-1/2  flex flex-col justify-between items-center gap-5 bg-gray-50 mt-8 rounded ">
          <Link
            href={`/pastQuestion/quizScreen?course=${course}&time=${time}&numberOfQuestions=${numberOfQuestions}`}
            className="py-4 gap-4 w-full text-lg gap-y-3 px-4 flex items-center  justify-center font-semibold focus:text-white hover:text-gray-100 rounded text-white bg-gray-800"
          >
            Start <Arrow className="text-white mb-1" />{" "}
          </Link>
          <button className="bg-gray-300 px-4 p-4 w-full rounded-md">
            {" "}
            <small
              className="
             text-sm"
            >
              {" "}
              Practice{"🪐"}
              With Friends{" "}
            </small>
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default PastQuestion;
