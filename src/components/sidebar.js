"use client";
import React from "react";
import Link from "next/link.js";
import { FaBoltLightning } from "react-icons/fa6";
// import { TbCalendarEvent as Events } from "react-icons/tb";
import { FiHome as Home2 } from "react-icons/fi";
import { logout } from "../libs/features/authSlice.js";
import { MdOutlineMore as More } from "react-icons/md";
import { LuLogOut as Logout } from "react-icons/lu";

import {
  MdOutlineLocalLibrary as Library2,
  MdOutlineAssignment as Assign,
} from "react-icons/md";
import {
  LuGrid2X2Plus as Resources,
  LuCalendarClock as Timetable,
  LuNotebookPen as Assignment,
} from "react-icons/lu";
import { removeItem } from "../utils/utils.js";
import { getAuth, signOut } from "firebase/auth";
import { useAppDispatch } from "@/libs/hook.js";
import { useRouter } from "next/navigation.js";
import Image from "next/image.js";

const SideBar = ({ route }) => {
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const data = [
    { name: "Home", icon: <Home2 className="text-lg" />, link: "/" },
    {
      name: "Timetable",
      icon: <Timetable className="text-lg" />,
      link: "/timetable",
    },
    {
      name: "Assignment",
      icon: <Assignment className="text-lg" />,
      link: "/assignment",
    },
    {
      name: "Resources",
      icon: <Resources className="text-lg" />,
      link: "/resources",
    },
  ];

  const handleLogout = () => {
    console.log("Logging Out");
    removeItem("qitt-user");
    dispatch(logout());
    navigate.push("/auth");
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <aside className="z-20 fixed sm:static sm:shadow-lg bottom-0 left-0 flex justify-center sm:flex-col sm:items-center bg-white py-1 sm:py-0 font-aeonik h-[70px] sm:h-screen w-full sm:w-[30%]">
      <div className="hidden sm:flex my-6 w-full justify-center sm:mr-14  items-end">
        <Image src={"/Qitt-Text-Logo.png"} width={100} height={100} unoptimized/>
      </div>

      <div className="flex border-t-2 border-t-gray-100 mx-auto sm:border-0 sm:flex-col w-screen sm:w-full h-full justify-between bg-red-5000 sm:justify-around py-1 items-start sm:overflow-y-auto sm:min-h-0">
        <div className="flex sm:flex-col items-center w-screen justify-between sm:items-start sm:justify-start sm:gap-4 xl:gap-4 h-full sm:w-[70%] bg-green-5000 px-2 sm:pt-4 bg-red-5000 sm:mx-auto">
          {data.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`px-3 py-2 flex w-full  flex-col text-md font sm:flex-row text-gray-600 ${
                item.name == route
                  ? "text-[#0A32F8] sm:bg-gradient-to-r from-[#DBE1FF] to-[#FFFFFF] "
                  : !route && item.name == "Home"
                  ? "text-[#0A32F8] sm:bg-gradient-to-r from-[#DBE1FF] to-[#FFFFFF]"
                  : ""
              } hover:text-black py-2 px-2 sm:hover:bg-gray-50 gap-2 rounded-md items-center`}
            >
              {item.icon}
              <p className="truncate text-sm sm:text-lg font-medium">
                {item.name}
              </p>
            </Link>
          ))}

          <div className="h-[3px] bg-gray-400 hidden sm:flex w-[78%] my-3">

          </div>
          <Link
            href={"/more"}
            className={`hidden px-3 py-2 sm:flex w-full  flex-col text-md font sm:flex-row text-gray-600 ${
              "more" == route
                ? "text-[#0A32F8] sm:bg-gradient-to-r from-[#DBE1FF] to-[#FFFFFF] "
                : !route && "more" == "Home"
                ? "text-[#707bb5] sm:bg-gradient-to-r from-[#DBE1FF] to-[#FFFFFF]"
                : ""
            } hover:text-black py-2 px-2 sm:hover:bg-gray-50 gap-2 rounded-md items-center`}
          >
            <More className="text-lg" />
            <p className="truncate text-[3vw] sm:text-lg font-medium">More</p>
          </Link>
        </div>

        <div className="mx-auto w-0 sm:w-[70%] pl-5">
          <div
            className="hidden sm:flex gap-3 sm:mx-auto  xl:mb-3 mb-2 text-red-500 hover:text-red-600  cursor-pointer"
            onClick={handleLogout}
          >
            <Logout className="text-xl font-medium" />
            Logout
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
