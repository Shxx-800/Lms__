import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-950 to-gray-900 w-full mt-10 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start px-6 md:px-12 lg:px-20 justify-between gap-10 py-8 border-b border-white/10">

        {/* Logo + Description */}
        <div className="flex flex-col md:items-start items-center w-full md:w-1/3">
          <img src={assets.logo_dark} alt="logo" className="w-36" />
          <p className="mt-4 text-sm text-gray-400 max-w-sm text-center md:text-left leading-relaxed">
            We aim to make quality education accessible for everyone through flexible, affordable, and expert-led online courses that fit your goals and schedule.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:items-start items-center w-full md:w-1/4">
          <h2 className="font-semibold text-white mb-4 text-lg">Company</h2>
          <ul className="flex md:flex-col justify-center gap-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact us</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy policy</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <h2 className="font-semibold text-white mb-4 text-lg">Subscribe to our newsletter</h2>
          <p className="text-sm text-gray-400 text-center md:text-left max-w-sm">
            Get the latest insights, updates, and resources directly to your inbox every week.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full max-w-sm">
            <input
              className="border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 outline-none w-full h-10 rounded px-3 text-sm"
              type="email"
              placeholder="Enter your email"
            />
            <button className="bg-blue-600 hover:bg-blue-700 transition-all w-full sm:w-28 h-10 text-sm font-medium rounded text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <p className="py-3 text-center text-xs md:text-sm text-gray-500">
        ©2025 SHXx. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
