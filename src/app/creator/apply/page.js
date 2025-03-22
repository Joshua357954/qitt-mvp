import { ArrowLeft, ArrowRight } from "lucide-react/dist/cjs/lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Apply() {
  const submited = false;
  return (
    <main className="bg-gray-200 h-screen font-aeonik">
      <section className="bg-white relative h-full w-full sm:w-1/2 mx-auto">
        <div className="py-3 border-b border-gray-600 text-center px-3 w-full flex justify-between items-center">
          <Link href={'/'}><ArrowLeft size={25} /></Link>
          <h1 className="font-extrabold text-xl sm:text-2xl ">
            Apply For Creator
          </h1>
          <p>&nbsp;</p>
        </div>

        <div className="bg-red-5000 sm:px-14 px-8 py-5 flex flex-col gap-8">
          <div className="flex flex-col">
            <span className="font-semibold"> Matriculation Number</span>
            <input
              className="border-2 rounded border-gray-600 py-2 px-2 placeholder:text-sm"
              placeholder="Provide matriculation number for verification"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold"> Social Media Handle</span>
            <input
              className="border-2 rounded border-gray-600 py-2 px-2 placeholder:text-sm"
              placeholder="Drop a social media handle that includes your pictures and bio"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">
              {" "}
              How often can you add content?{" "}
            </span>
            <input
              className="border-2 rounded border-gray-600 py-2 px-2 placeholder:text-sm"
              placeholder="Example: everyday, Two times a week"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">
              {" "}
              Why do you want to be a Qitt creator?{" "}
            </span>
            <textarea
              className="border-2 rounded border-gray-600 py-2 px-2 placeholder:text-sm"
              placeholder="Brief Summery"
            ></textarea>
          </div>
          <button className="flex text-white items-center justify-center gap-5 bg-[#0A32F8] hover:bg-blue-700 rounded p-3">
            Apply <ArrowRight color="white" />
          </button>
        </div>

        {submited ? <HurrayModal /> : ""}
      </section>
    </main>
  );
}

export function HurrayModal() {
  return (
    <div className="h-screen py-6 flex flex-col px-10 bg-white absolute top-0 right-0 w-full justify-between items-center">
        <div>&nbsp;</div>
      <div className="mx-auto bg-red-6000 flex justify-center flex-col items-center w-2/3 gap-10">
        <Image src={"/hurray.png"} width={70} height={70} />
        <p>
          Thanks for applying to be a creator on Qitt! We’re currently reviewing
          your application and will get back to you soon.
        </p>
      </div>
      <button className="flex w-2/3 mx-auto text-white items-center justify-center gap-5 bg-[#0A32F8] hover:bg-blue-700 rounded p-3">
        Return Home <ArrowRight color="white" />
      </button>
    </div>
  );
}
