import React, { useState } from "react";
import { Link, ScrollRestoration } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

const NotFound = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    } else {
      localStorage.setItem("theme", theme);
    }
    document.querySelector("html").setAttribute("class", localTheme);
  }, [theme]);
  return (
    <section className="bg-white flex items-center  text-gray-100">
      <Helmet>
        <title>ThriveFit | Not Found</title>
      </Helmet>
      <ScrollRestoration />
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800  md:text-3xl">
            Page not found
          </h1>
          <p className="mt-4 text-gray-500 ">
            The page you are looking for doesn't exist. But you can find plenty of things on our
            homepage.
          </p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Link
              to="/"
              className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600  "
            >
              Take me home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;