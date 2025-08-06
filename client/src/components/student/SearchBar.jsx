import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data || '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate('/course-list/' + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full h-11 md:h-14 flex items-center backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-lg shadow-blue-500/5 overflow-hidden transition-all"
    >
      <img
        className="w-5 md:w-6 px-3 opacity-80"
        src={assets.search_icon}
        alt="search"
      />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-full bg-transparent outline-none text-sm md:text-base text-white placeholder-gray-400 px-1"
        placeholder="Search for courses"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-all text-white text-sm md:text-base font-medium px-4 md:px-6 py-2 md:py-2.5 rounded-none h-full"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
