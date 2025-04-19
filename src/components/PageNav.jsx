import Link from "next/link.js";
import { FaChevronLeft as Arrow } from "react-icons/fa";
// import BackA from "../assets/images/arrow-left.svg";
import Image from "next/image";
import { ChevronLeft } from "lucide-react/dist/cjs/lucide-react";

const PageNav = ({ url, name, right }) => {
  return (
    <div className="z-10 sticky top-0 right-0 flex gap-7 sm:gap-8  h-[70px] bg-gray-50 items-center text-gray-100 px-3 justify-between">
      <div className="flex items-center gap-8">
        <ChevronLeft
          onClick={() => window.history.back()}
          size={30}
          className="text-gray-900 ml-3 font-extrabold "
        />
        <p
          className="text-black font-bold text-xl mt-[3px] flex flex-1 flex-nowrap capitalize"
          style={{ "white-space": "nowrap" }}
        >
          {url}
        </p>
      </div>
      {!right ? (
        <small className="">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </small>
      ) : (
        right
      )}
    </div>
  );
};

export default PageNav;
