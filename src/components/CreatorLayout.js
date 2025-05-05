"use client";
import { ArrowLeft, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";

export default function CreatorLayout({ children, screenName, Button }) {
  return (
    <main className="w-full font-aeonik">
      {/* Nav 1 */}
      <div className="flex gap-5 items-center p-5 border-b border-gray-500 bg-black">
        <ArrowLeft
          size={20}
          color={"white"}
          onClick={() => window.history.back()}
        />

        <p className=" text-2xl font-bold text-white">Creator</p>
        {/* <p className="text-blue-400 bg-blue-400  py-3 bg-opacity-30 font-semibold rounded-full px-4">Resources</p> */}
      </div>

      {/* Nav 2 */}
      <nav className="flex sm:justify-between justify-center py-4 items-center border-b border-gray-400">
        <div className="w-3/4 mx-auto flex items-center justify-between">
          <h2 className="text-xl text-center font-semibold">{screenName}</h2>
          {Button && Button}
        </div>
      </nav>

      {/* Main Section */}
      <section className="w-full px-8 sm:px-0 sm:w-3/4 mx-auto">
        {/* Main Content */}
        <div className="w-full sm:w-1/3 mx-auto py-5 flex flex-col gap-7">
          {children}
        </div>
      </section>
    </main>
  );
}
