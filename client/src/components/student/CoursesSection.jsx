import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="bg-white dark:bg-gray-900 py-12 px-4 md:px-8 lg:px-16"> {/* Reduced py */}
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
          Learn from the Best
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-xl mx-auto">
          Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
        </p>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8 md:my-12"> {/* Reduced gap and margin */}
          {allCourses.slice(0, 4).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/course-list"
          onClick={() => scrollTo(0, 0)}
          className="inline-block mt-4 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all px-5 md:px-7 py-2 md:py-2.5 rounded-md text-sm md:text-base font-medium"
        >
          Show all courses
        </Link>
      </div>
    </section>
  );
};

export default CoursesSection;
