"use client";
import MainLayout from "@/components/MainLayout";
import React from "react";
import { TbMessage } from "react-icons/tb";
import { FiShield } from "react-icons/fi";
import { LuNotebookPen } from "react-icons/lu";
import { FaShieldAlt, FaUserEdit, FaComments } from "react-icons/fa";

function page() {
  const features = [
    { name: "Privacy Policy", icon: <FaShieldAlt />, link: "/privacy-policy" },
    {
      name: "Apply for Creator",
      icon: <LuNotebookPen />,
      link: "/creator/apply",
    },
    { name: "Feedback", icon: <TbMessage />, link: "/feedback" },
  ];

  return (
    <MainLayout route={"More"}>
      <div className="bg-gray-1000 rounded-lg p-6 h-full w-[95%] sm:w-[50%] mx-auto">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center space-x-14 shadow px-6 rounded-sm py-6 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <span className="text-xl">{feature.icon}</span>
              <a href={feature.link} className="text-lg font-semibold">
                {feature.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
}

export default page;
