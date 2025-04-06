import React from "react";
import Link from "next/link.js";
import { useSelector } from "react-redux";
import Image from "next/image";
import { MoreVertical } from "lucide-react/dist/cjs/lucide-react";
import useAuthStore from "@/app/store/authStore";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdNotifications } from "react-icons/md";

const NavBar = ({ route }) => {
  const { user: userData } = useAuthStore();

  const getName = (name) => name?.split(" ")[0];

  return (
    <nav
      className={`w-full h-[80px] sm:h-[70px] flex justify-between items-center border-b-[1] pt-2 py-3`}
    >
      <div className="hidden sm:flex sm:w-[60%]  h-full bg-gre-en-400 pl-3 justify-start items-center">
        <p className="text-2xl font-light">
          {route || (
            <span>
              Good Morning,{" "}
              <b className="font-semibold ">{userData?.nickname}</b>
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-row-reverse sm:flex-row px-1 justify-between sm:justify-around sm:px-3 items-center gap-2 bg-yel-low-300 w-full sm:w-[40%] py-5 ">
        {" "}
        <div className="flex gap-5 items-center">
          <Link href="/creator" className="">
            <Image src={"/creator.png"} width={40} height={40} unoptimized />
          </Link>

          <Link href={"/notification"} className={`relative`}>
            <IoNotificationsOutline className="font-extrabold text-3xl" />
            <span className="w-3 h-3 rounded-full absolute bg-red-600 top-0 -right-0"></span>
          </Link>

          <Link href={"/more"} className={`sm:hidden relative`}>
            <MoreVertical className="text-lg" size={30} />
          </Link>
        </div>
        <div className="flex items-center ml-2 gap-3 w-fit select-none text-black">
          {/* Image */}
          <Link href="/profile">
            <div className="w-14 h-14 border-[2px] border-gray-300 rounded-full bg-gray-400">
              <Image
                src={userData?.imageURL || "/profile-defalt.png"}
                width={10}
                height={10}
                className="w-full h-full rounded-full bg-cover object-cover size"
                alt="Profile Image"
                unoptimized
              />
            </div>
          </Link>
          {/* Meta */}
          <div className="flex flex-col  ">
            <div className="text-lg">
              {" "}
              Hey,
              <span className="font-bold capitalize">
                {" "}
                {getName(userData?.name) || "User"}
              </span>
            </div>
            <div className="flex font-light items-center gap-1 text-md  text-gray-700">
              <div className="text-sm truncate w-fit">
                {userData?.department?.split("_").join(" ") || "Qitt"}
              </div>
              <div className="w-2 h-2 rounded-full text-sm bg-gray-800">
                &nbsp;
              </div>
              <div className="text-sm">
                {userData?.level}
                {"lvl"}
              </div>
              {/* <div>{getCurrentUniYear(userData.session)|| 0}00lvl</div> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

{
  /* Timetable View */
}
// <div className="w-[35%] h-full bg-white flex flex-col gap-3 px-2">
// 			<h2 className="font-semibold text-xl  mt-3 ">Today's Classes</h2>
// <div className="w-full h-full flex flex-col items-center justify-center  ">

{
  /* Classes */
}
// <div className=" flex flex-col h-full items-start w-full ">
// { courses.map((item,idx) => {
// return (<div className="flex border-b-2 border-b-gray-100 w-full mt-2 items-center justify-between  px-2">
// <p className="w-[40%]"> {item.time}</p>
// <div className={`bg-purple-400  font-black rounded  h-full w-[5px] text-center`}></div>
{
  /*<div className="flex flex-col w-[40%]">*/
}
{
  /*<p className="font-bold">{item.course}</p>*/
}
{
  /*<p className="font-light truncate">{item.venue}</p>*/
}
// </div>
{
  /*</div>)*/
}
// })
// }
// </div>

{
  /*</div>*/
}

{
  /*<div className="w-full h-full max-w rounded-md bg-none my-1 ">*/
}

{
  /*</div>*/
}
{
  /*</div>*/
}
