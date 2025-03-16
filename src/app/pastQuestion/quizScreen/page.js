"use client";
import React, { useState, useEffect, Suspense } from "react";
import ScoreModal from "../../../components/ScoreModal.js";
import { FaChevronLeft as Right } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation.js";
import Loader from "@/components/Loader.jsx";

// Updated Question component
const Question = ({ question, options, id, idx, setAnswers, answers }) => {
  const [ans, setAns] = useState(answers[id] || null);

  function handleClick({ ids, qid, answer }) {
    setAns(ids);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [qid]: options[parseInt(answer)],
    }));
  }

  return (
    <div className="w-full">
      <div className="mt-3 font-semibold flex items-center gap-1">
        <h2>Q{idx + 1}. </h2>
        <p className="mt-3 font-semibold flex items-center mb-1">{question}</p>
      </div>

      {options.map((opt, ids) => (
        <label key={ids} className="ml-2 flex gap-x-4 font-light">
          <input
            value={ids}
            id={ids}
            checked={ids == ans}
            onChange={({ target }) =>
              handleClick({ ids, qid: id, answer: target.value })
            }
            type="radio"
            className="mr-1"
          />
          <p>{opt.split(" ").slice(1).join(" ")}</p>
        </label>
      ))}
    </div>
  );
};

// QuizScreen component
const QuizScreen = ({ className }) => {
  const navigate = useRouter();

  const searchParams = useSearchParams();

  const course = searchParams.get("course");
  const time = searchParams.get("time");
  const numberOfQuestions = searchParams.get("numberOfQuestions");

  const initialTimeInSeconds = time * 60;
  const [timer, setTime] = useState(initialTimeInSeconds);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTime((prevTime) =>
        prevTime > 0
          ? prevTime - 1
          : (() => {
              submitQuiz();
              clearInterval(timerInterval);
              return 0;
            })()
      );
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer]);

  const formattedTime = new Date(timer * 1000).toISOString().substr(14, 5);

  const [submitted, setSubmitted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [result, setResult] = useState({});

  function leaveQuiz(e) {
    e.preventDefault();
    return navigate.push("/pastQuestion?q=practice");
  }

  function closeModal() {
    setSubmitted(false);
  }

  async function submitQuiz() {
    // submit users answer to submit quiz route
    const submit = await axios.post(`/api/pastquestion/quiz`, {
      subject: course,
      totalQuestions: numberOfQuestions,
      answers,
    });
    console.log(submit.data);
    setResult(submit.data);
    setSubmitted(true);
  }

  function endQuiz() {
    toast.custom(
      (t) => (
        <div
          className={`toast-container ${
            t.visible ? "animate-enter" : "animate-leave"
          } shadow-lg rounded-md border-t-2 border-t-gray-200`}
        >
          <div className="p-4 flex items-start bg-white">
            <div className="flex-1 ml-3 bg-slate-50">
              <p className="text-md text-gray-900 font-extrabold bg-white">
                Are You Sure You Want To End This Quiz Session?
              </p>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                submitQuiz();
              }}
              className="w-full border bg-white border-transparent rounded-none p-4 flex items-center justify-center text-lg font-extrabold text-red-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border bg-white border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-lg font-extrabold text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 90000,
      }
    );
  }

  useEffect(() => {
    async function getQuestions() {
      const response = await axios.get(
        `/api/pastquestion/quiz?subject=${course}&numberOfQuestions=${numberOfQuestions}`
      );
      console.log(response.data);
      setQuestions(response.data.questions);
    }
    getQuestions();
  }, [course, numberOfQuestions]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleUnload = (e) => {
      // Perform actions before the page is unloaded
      e.preventDefault();
      console.log("Page is being unloaded");
    };

    window.addEventListener("unload", handleUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    // Perform any other necessary actions before reloading
    window.location.reload();
  };

  if (!questions[0]) {
    return <Loader />;
  }

  return (
      <main className="w-full">
        <section className="w-full relative h-full overflow-y-auto">
          {/* Quiz Screen */}
          {/* {JSON.stringify(answers)}
    {typeof(answers)} */}
          <nav className="fixed top-0 right-0 w-full h-16 flex justify-between items-center bg-yellow-400 px-2">
            <div className="flex gap-x-5 items-center h-full">
              <button className="bg-none border-none" onClick={leaveQuiz}>
                <Right className="text-gray-700" />{" "}
              </button>

              <div className="flex flex-col justify-center w-full px-2 bg-blue-1000 h-full">
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 capitalize">
                  {course}
                </p>
                <div className="text-sm text-gray-600 font-semibold">
                  {Object.keys(answers).length} out {numberOfQuestions}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-sm">Time Remaining</p>
              <p className="font-bold text-gray-800">{formattedTime} mins</p>
            </div>
          </nav>

          <section className="w-full flex justify-center items-center mt-16">
            <div className="w-full sm:w-[80%] px-3 sm:px-0 pb-4 pt-2 bg-blue-00 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {questions?.map((item, idx) => (
                <Question
                  key={item.id}
                  question={item.question}
                  options={item.options}
                  id={item.id}
                  idx={idx}
                  setAnswers={setAnswers}
                  answers={answers}
                />
              ))}
            </div>
          </section>

          <div className="flex flex-col p-2 h-full gap-2 bg-yellow-40 my-4 w-full items-center">
            <button
              onClick={endQuiz}
              style={{ backgroundColor: "red" }}
              className="w-[40%] h-16 hover:bg-red-400 text-white"
            >
              Submit
            </button>
            <p className="bg-blue-00 text-sm flex justify-start items-start text-center font-light underline">
              By clicking this you agree to end your practice session
            </p>
          </div>
        </section>
        {/* action= backdoor input hide  */}
        {submitted ? (
          <ScoreModal callback={closeModal} quizResults={result} />
        ) : (
          ""
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md">
              <p className="text-gray-800 mb-4">
                Are you sure you want to leave this page? Your unsaved changes
                may be lost.
              </p>
              <div className="flex space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleCloseModal}
                >
                  Leave Page
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCloseModal();
                  }}
                >
                  Stay on Page
                </button>
              </div>
            </div>
          </div>
        )}

        <Toaster />
      </main>
  );
};

export default QuizScreen;
