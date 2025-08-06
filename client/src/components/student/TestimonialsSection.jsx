import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <section className="bg-gradient-to-b from-white via-cyan-50 to-white px-6 md:px-20 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center">
          What Our Learners Say
        </h2>
        <p className="text-gray-500 text-sm md:text-base text-center mt-4">
          Hear from learners as they share stories of transformation and success through our platform.
        </p>

        <div className="grid gap-10 mt-14 md:grid-cols-2 lg:grid-cols-3">
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center gap-4 px-6 py-5 bg-gray-50">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      className="h-5"
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                      alt="star"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {testimonial.feedback}
                </p>
              </div>

              <div className="px-6 pb-5">
                <a href="#" className="text-blue-500 text-sm font-medium hover:underline">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
