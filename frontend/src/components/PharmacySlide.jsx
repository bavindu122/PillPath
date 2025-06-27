import React from 'react';
import { MapPin, Locate, Search } from 'lucide-react';
import { assets } from '../assets/assets';

const PharmacySlide = () => {
  return (
    <div className='flex flex-col min-h-[75vh] md:flex-row flex-wrap bg-gradient-to-b from-primary to-primary-hover z-0 rounded-2xl px-4 md:px-8 lg:px-18 shadow-lg'>
      <div className='w-full text-center md:text-left mb-8 fade-in'>
        <h1 className='text-4xl font-bold flex items-center justify-center gap-2 heading-highlight'>
          <span className='text-7xl sm:text-9xl text-white'>PHAR</span>
          <img src={assets.logo2} alt="icon" className="w-34 h-34 filter drop-shadow-lg" />
          <span className='text-7xl sm:text-9xl text-white'>MACY</span>
        </h1>
      </div>

      <div className='flex items-center justify-between mx-auto'>
        <div className="flex flex-col justify-center my-6 gap-8 fade-in" style={{animationDelay: '0.2s'}}>
          <p className="text-2xl font-medium text-white">Find pharmacies <br/> near you</p>
          <ul className="text-base space-y-4 text-white stagger-fade-in">
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Click Find the Nearest Pharmacy</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Allow GPS Access</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Browse Your Favorite Pharmacy</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={assets.pharmacy_img}
            alt="Pharmacy service"
            className="object-contain h-110 mx-3 float-animation drop-shadow-2xl"
          />
        </div>

        <div className="fade-in" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col items-center justify-center mb-6 h-50 w-80 bg-upload-bg rounded-xl gap-3 hover:translate-y-[-5px] transition-all duration-300 shadow-xl">
            <div className='bg-upload-bg-hover p-4 rounded-t-xl flex flex-col justify-center items-center w-full'>
              <p className="mb-4 text-sm font-medium text-primary">Discover pharmacies in your area</p>
              <MapPin className="w-10 h-10 text-primary animate-pulse drop-shadow-md" />
            </div>
            <button className="px-4 my-3 bg-secondary text-white py-3 rounded-full hover:bg-secondary-hover transition-all pulse-on-hover shadow-md">
              <div className='flex gap-2 items-center font-medium'><Locate size={18}/><span>Find nearby pharmacy</span></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacySlide;