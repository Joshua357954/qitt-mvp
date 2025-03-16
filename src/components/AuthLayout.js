import Image from "next/image";
import React from "react";

function AuthLayout({ children, choose }) {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2">
      {/* Section 1: Hidden on small screens */}
      <section className="bg-gray-500 h-screen relative transition-ease-in-out hidden sm:block ">
        <Image
          src={choose == 2 ? "/qitt-reg-img-1.jpg" : "/qitt-reg-2.jpg"}
          width={100}
          height={100}
          alt="Registration banner image"
          unoptimized
          className="reg-i1 w-full h-full object-cover"
        />
        {!choose  ? (
          <div className="absolute bottom-9 left-7 w-[80%] px-6 py-6  bg-white/5 backdrop-blur-md   shadow-lg border-gray-200 rounded-md">
            <h1 className="text-4xl font-black text-white leading-tight">
              Stay organize, stay
              <br /> Connected and keep
              <br /> Smiling !
            </h1>
          </div>
        ) : <div></div> 
        // (
        //   <div className="absolute bottom-9 left-7 w-[80%] flex flex-col gap-4 px-4 py-5  bg-white/10 backdrop-blur-md shadow-lg rounded-md">
        //     <h1 className="font-aeonik text-3xl font-black text-white tracking-wide">
        //       All Your Academic <br />
        //       Needs, One Platform.
        //     </h1>
        //     <p className="font-aeonik tracking-wide mt-1 w-[90%] text-white ">
        //       Streamline your academic life with Qitt—organized, connected, and
        //       simple. Create an account today to get started!
        //     </p>
        //   </div>
        // )
        }
      </section>

      {/* Section 2 */}
      <section className="bg-gray-50 h-screen ">{children}</section>
    </main>
  );
}

export default AuthLayout;
