import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {

    const { currency, calculateRating } = useContext(AppContext);

    if (!course) {
        return null;
    }

    const rating = calculateRating(course) || 0;
    const finalPrice = course.coursePrice - (course.discount * course.coursePrice / 100);
    return (
        <Link
            onClick={() => scrollTo(0, 0)}
            to={'/course/' + course._id}
            className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg hover:shadow-lg transition-shadow bg-white"
        >
            <img className="w-full aspect-video object-cover" src={course.courseThumbnail} alt={course.courseTitle} />
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{course.courseTitle}</h3>
                <p className="text-gray-600 text-sm mb-2">{course.educator?.name || 'Unknown Educator'}</p>
                <div className="flex items-center space-x-2">
                    <p className="text-gray-700 font-medium">{rating.toFixed(1)}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-3.5 h-3.5"
                                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                                alt=""
                            />
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm">({course.courseRatings?.length || 0})</p>
                </div>
                <p className="text-base font-semibold text-gray-800 mt-2">
                    {currency}{finalPrice.toFixed(2)}
                </p>
            </div>
        </Link>
    );
};

export default CourseCard;
