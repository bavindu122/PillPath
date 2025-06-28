import React from 'react'
import { assets } from '../assets/assets'
import { Camera, Upload, PlusCircle } from 'lucide-react'

const Header = () => {
  return (
    <div className='relative flex flex-col min-h-[75vh] md:flex-row flex-wrap bg-gradient-to-b from-primary to-primary-hover z-0 rounded-2xl px-4 md:px-8 lg:px-18 shadow-lg overflow-hidden'>
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* Animated circle pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-xl animate-float-delay"></div>
        
        {/* Medical cross patterns */}
        <div className="medical-pattern absolute inset-0 opacity-5"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-secondary/20 rounded-full animate-pulse-slow"></div>
      </div>

      <div className='w-full text-center md:text-left mb-8 fade-in relative z-10'>
        <h1 className='text-4xl font-bold flex items-center justify-center gap-2 heading-highlight'>
          <span className='text-7xl sm:text-9xl text-white'>PILL</span>
          <img src={assets.logo2} alt="icon" className="w-34 h-34 filter drop-shadow-lg" />
          <span className='text-7xl sm:text-9xl text-white'>PATH</span>
        </h1>
      </div>

      <div className='flex items-center justify-between mx-auto relative z-10 gap-20'>
        <div className="flex flex-col justify-center my-6 gap-8 fade-in" style={{animationDelay: '0.2s'}}>
          <p className="text-2xl font-medium text-white">All your Medicine <br/> needs in one place</p>
          <ul className="text-base space-y-4 text-white stagger-fade-in">
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Take a Picture of your Prescription</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Upload the Prescription</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Select Pharmacies to Order</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={assets.header_img}
            alt="delivery person"
            className="object-contain h-110 mx-3 float-animation drop-shadow-2xl"
          />
        </div>

        <div className="fade-in" style={{animationDelay: '0.4s'}}>
          <div className="flex flex-col items-center justify-center mb-6 h-50 w-80 bg-upload-bg backdrop-blur-md rounded-xl gap-3 hover:translate-y-[-5px] transition-all duration-300 shadow-xl card-shine">
            <div className='bg-upload-bg-hover p-4 rounded-t-xl flex flex-col justify-center items-center w-full'>
              <p className="mb-4 text-sm font-medium text-primary">Take a picture of your doctor prescription</p>
              <Camera className="w-10 h-10 text-primary animate-pulse drop-shadow-md" />
            </div>
            <button className="px-4 my-3 bg-secondary text-white py-3 rounded-full hover:bg-secondary-hover transition-all pulse-on-hover shadow-md">
              <div className='flex gap-2 items-center font-medium'><Upload size={18}/><span>Upload prescription</span></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Wave effect at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-5">
        <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(255,255,255,0.1)" fillOpacity="1" 
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
          </path>
        </svg>
      </div>
    </div>
  )
}

export default Header