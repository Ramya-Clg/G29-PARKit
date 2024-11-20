import React from "react";
import { Feedback } from "./Feedback";
import { Footer } from "./Footer";

export function Old() {
  return (
    <div className="min-h-screen w-full bg-[var(--text-light)] flex flex-col justify-center relative">
      {/* Gradient Background */}
      <div
        className="fixed top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[var(--background-secondary)] to-transparent -z-10"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center min-h-screen">
        {/* Left Content */}
        <div className="flex flex-col justify-start items-start mt-16 md:mt-24 w-full md:w-1/2 mb-12 md:mb-0">
          <h2 className="font-inter text-2xl md:text-xl text-[var(--text-primary)] tracking-[0.7em] mb-2">
            WELCOME TO
          </h2>
          <h1 className="font-inter text-7xl md:text-8xl lg:text-8xl font-bold text-[var(--text-primary)] mb-6">
            PARKit
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-primary)] max-w-lg mb-8">
            A modern and user-friendly parking experience that saves you time
            and stress.
          </p>
          <button className="w-fit bg-[var(--text-secondary)] hover:bg-opacity-90 text-[var(--text-light)] px-8 py-4 text-lg md:text-xl rounded-md shadow-lg flex flex-col items-center justify-center">
            <span className="font-inter font-regular text-[var(--text-light)]">
              Get Started
            </span>
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-16">
          <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
            <img
              src="../../98dccff4-ffde-477a-b190-95ee15324f8b.png"
              alt="Car next to parking sign illustration"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="flex items-center justify-left mt-24">
        <img
          src="../../freepik__modern-style-detailled-illustration-image-of-parke__1975.jpeg"
          alt="image of parked cars"
          className="w-[500px] h-[500px] m-[200px]"
        />
        <p className="mr-14">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo in
          officiis, autem assumenda perferendis asperiores! Reiciendis magni,
          atque quisquam officia incidunt quibusdam ducimus iste corporis
          architecto illo non nobis labore. Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Totam atque soluta dolore distinctio
          inventore minima hic. Ullam impedit odit laboriosam omnis animi dolor
          consequatur, sapiente aperiam magnam necessitatibus quae
          assumenda!Lorem Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Dolorum incidunt tenetur nemo itaque quibusdam necessitatibus!
          Animi amet cumque facere? Ipsam, unde molestiae saepe accusantium
          impedit assumenda architecto beatae quos quidem!
        </p>
      </div>

      <Feedback />
      <Footer />
    </div>
  );
}
