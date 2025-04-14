import React from "react";
import SideBar from "./sidebar.js"; // Assuming this is your Sidebar component
import Navbar from "../components/NavBar.jsx"; // Assuming this is your Navbar component
import PageNav from "../components/PageNav.jsx"; // Assuming this is your PageNav component

const MainLayout = ({ children, route, right }) => {
  return (
    <main className="flex sm:shadow-lg font-aeonik transition-shadow duration-300 ease-in-out h-full w-full select-none">
      {/* Sidebar */}
      {<SideBar route={route} />}

      {/* Homepage & Timetable */}
      <section className="w-full h-full flex flex-col overflow-y-auto">
        {/* Navbar */}
        {route.trim() ? (
          <PageNav url={route} right={right} />
        ) : (
          <Navbar route={route} />
        )}

        <section className="w-full flex h-full bg- px-2 pt-2  overflow-y-auto">
          {/* HomePage (Children content goes here) */}
          {children}
        </section>

        {/* Sharrade Div */}
        <div className="w-full h-[70px] sm:h-0"></div>
      </section>
    </main>
  );
};

export default MainLayout;
