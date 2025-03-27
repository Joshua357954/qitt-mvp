"use client";
import React, { useState } from "react";
import { BsSend as Chat } from "react-icons/bs";
import PageNav from "../../components/PageNav.jsx";
import axios from "axios";
import { BsFillEmojiSmileFill as Smile } from "react-icons/bs";
import { BsFillEmojiNeutralFill as Neutral } from "react-icons/bs";
import { BsFillEmojiFrownFill as Sad } from "react-icons/bs";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const FeedbackScreen = () => {
  const minLength = 12;
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const userData = useSelector((state) => state.user);

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const sendFeedback = async () => {
    if (!text.trim()) {
      return toast.error("Please Write A Review", {
        icon: "⚠️",
        duration: 3000,
      });
    } else if (text.trim().length < minLength) {
      return toast.error("Oops! Short review. Can you share more? 😊", {
        icon: "⚠️",
        duration: 3000,
      });
    }

    const url =
      "https://api.sheety.co/155adde26f27dac3cd7ad0a9ca54cbd7/qittApp/feedback";
    const feedbackData = {
      emoji: selectedEmoji || "No Emoji Selected",
      feedback: text.trim(),
      username: userData.name || "QITT",
      email: userData.email || "1",
      department: userData.department || "KIT",
    };

    setLoading(true);
    try {
      await axios.post(url, { feedback: feedbackData });
      setText("");
      setSelectedEmoji(null);
      toast.success("Feedback Sent 💌");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error sending feedback 🚫");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full">
      <PageNav url="Feedback" />
      <div className="bg-blue-20 w-full sm:w-1/3 px-9 sm:px-0 h-full bg-gray-5000 mx-auto gap-10 flex-col justify-around flex pt-5">
        <div>
          <h1 className="text-lg font-semibold mb-4">
            How Satisfied Are You With Qitt?
          </h1>
          <div className="flex justify-around w-full">
            <Sad
              size={35}
              className={`cursor-pointer ${
                selectedEmoji === "sad" ? "text-red-500" : "hover:text-red-300"
              }`}
              onClick={() => handleEmojiClick("sad")}
            />
            <Neutral
              size={35}
              className={`cursor-pointer ${
                selectedEmoji === "neutral"
                  ? "text-yellow-500"
                  : "hover:text-yellow-300"
              }`}
              onClick={() => handleEmojiClick("neutral")}
            />
            <Smile
              size={35}
              className={`cursor-pointer ${
                selectedEmoji === "smile"
                  ? "text-green-500"
                  : "hover:text-green-300"
              }`}
              onClick={() => handleEmojiClick("smile")}
            />
          </div>
        </div>
        <textarea
          className="w-full p-2 text-md border h-32 border-black resize-none rounded-sm"
          placeholder="Tell us more!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-700 text-white py-3 flex font-bold justify-center items-center rounded-sm"
          onClick={sendFeedback}
          disabled={loading}
        >
          {loading ? "Sending..." : "Share Feedback"}
        </button>
        <Toaster />
      </div>
    </div>
  );
};

export default FeedbackScreen;
