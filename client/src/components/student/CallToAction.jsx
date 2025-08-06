import React from 'react';
import { assets } from '../../assets/assets';

const CallToAction = () => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white px-4 pt-12 pb-0"> {/* Removed bottom padding */}
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
        <h1 className="md:text-4xl text-2xl font-semibold text-black">
          Learn anything, anytime, anywhere
        </h1>
        <p className="text-black max-w-2xl text-sm md:text-base leading-relaxed">
          Gain access to expert-led courses in tech, business, design, and more — available 24/7 on any device. Whether you're upgrading your skills or starting a new career path, we’ve got you covered.
        </p>

        {/* Banner message */}
        <div className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-medium text-sm md:text-base shadow-md">
          🎓 Enroll today and join thousands of learners growing their future!
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
