import React from "react";

export function Home() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-white flex flex-col justify-center relative">
      {/* Gradient Background */}
      <div
        className="fixed top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#CBE4DE] to-transparent -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center min-h-screen">
        {/* Left Content */}
        <div className="flex flex-col justify-center w-full md:w-1/2 mb-12 md:mb-0">
          <div className="flex flex-col justify-start items-start">
            <h2 className="font-serif text-2xl md:text-4xl text-[#2C3333] tracking-[0.34em] mb-2">
              WELCOME TO
            </h2>
            <h1 className="font-sans text-7xl md:text-8xl lg:text-9xl font-semibold text-[#2C3333] mb-6">
              PARKit
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#2C3333] max-w-lg mb-8">
            A modern and user-friendly parking experience that saves you time
            and stress.
          </p>
          <button className="w-fit bg-[#5B8F8F] hover:bg-[#4A7A7A] text-white px-8 py-4 text-lg md:text-xl rounded-md shadow-lg flex flex-col items-center justify-center">
            BOOK NOW
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
            <img
              src="../../98dccff4-ffde-477a-b190-95ee15324f8b.png"
              alt="Car next to parking sign illustration"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
