import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg md:text-xl font-medium text-gray-700 mb-10">
          Trusted by learners from these top global companies
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
          <img
            className="w-24 md:w-28 brightness-90 hover:brightness-100 opacity-80 hover:opacity-100 transition duration-300"
            src={assets.microsoft_logo}
            alt="Microsoft"
          />
          <img
            className="w-24 md:w-28 brightness-90 hover:brightness-100 opacity-80 hover:opacity-100 transition duration-300"
            src={assets.walmart_logo}
            alt="Walmart"
          />
          <img
            className="w-20 md:w-24 brightness-90 hover:brightness-100 opacity-80 hover:opacity-100 transition duration-300"
            src={assets.accenture_logo}
            alt="Accenture"
          />
          <img
            className="w-20 md:w-24 brightness-90 hover:brightness-100 opacity-80 hover:opacity-100 transition duration-300"
            src={assets.adobe_logo}
            alt="Adobe"
          />
          <img
            className="w-20 md:w-24 brightness-90 hover:brightness-100 opacity-80 hover:opacity-100 transition duration-300"
            src={assets.paypal_logo}
            alt="Paypal"
          />
        </div>
      </div>
    </section>
  );
};

export default Companies;
