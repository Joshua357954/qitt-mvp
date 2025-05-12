"use client";
import React, { useState } from "react";
import PageNav from "../../components/PageNav.jsx";
import { BsFillEmojiSmileFill as Smile } from "react-icons/bs";
import { BsFillEmojiNeutralFill as Neutral } from "react-icons/bs";
import { BsFillEmojiFrownFill as Sad } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../store/authStore.js";

const FeedbackScreen = () => {
  // Minimum length for feedback text
  const minLength = 12;

  // State variables
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  // Destructure user data from the store
  const { user: userData } = useAuthStore();

  // Function to handle emoji selection
  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  // Function to send feedback to Sheety API
  const sendFeedback = async () => {
    // Input validation
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

    // Data structure for the feedback
    const feedbackData = {
      experience: selectedEmoji || "No Emoji Selected",
      feedback: text.trim(),
      name: userData?.name || "QITT",
      email: userData?.email,
      department: userData?.department || "KIT",
    };

    // API endpoint for Sheety
    const url =
      "https://api.sheety.co/8b35da8ed66eeb5e24fa4b4c111ade84/qittAppFeedbacks/sheet1";

    // Set loading to true before API call
    setLoading(true);

    try {
      // Sending data to Sheety
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheet1: feedbackData,
        }),
      });

      // Handling API response
      if (response.ok) {
        const json = await response.json();
        console.log("Feedback Response:", json.sheet1);
        toast.success("Feedback Sent 💌");
        // Clear the form after successful submission
        setText("");
        setSelectedEmoji(null);
      } else {
        throw new Error("Failed to send feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error sending feedback 🚫");
    } finally {
      // Set loading back to false
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <PageNav url="Feedback" />

      <div className="bg-blue-20 w-full sm:w-1/3 px-9 sm:px-0 h-full bg-gray-5000 mx-auto gap-10 flex-col justify-around flex pt-5">
        <div>
          <h1 className="text-lg font-semibold mb-4">
            How Satisfied Are You With Qitt?
          </h1>

          {/* Emoji Selection */}
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

        {/* Textarea for feedback */}
        <textarea
          className="w-full p-2 text-md border h-32 border-black resize-none rounded-sm"
          placeholder="Tell us more!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {/* Submit button */}
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
