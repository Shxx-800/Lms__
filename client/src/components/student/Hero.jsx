import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
  return (
    <section className="w-full px-5 md:px-0 py-20 md:py-28 text-center bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center space-y-8 px-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug text-white relative">
          Your Learning, Your Way.
          <span className="block text-blue-500">Courses tailored to your dreams.</span>
          <img
            src={assets.sketch}
            alt="sketch"
            className="absolute md:block hidden -bottom-6 right-0 w-20 opacity-80"
          />
        </h1>

        <p className="text-sm sm:text-base md:text-base text-gray-400 max-w-2xl">
          Whether you're starting out or leveling up, find the right path with expert-guided learning.
        </p>

        {/* Glassmorphism Search Box */}
        <div className="w-full max-w-xl">
          <div className="backdrop-blur-md bg-white/5 border border-gray-700 rounded-xl p-4 shadow-xl shadow-blue-500/10">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
