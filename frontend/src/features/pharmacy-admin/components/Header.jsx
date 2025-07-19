import React from 'react';
import { BellDot, CircleUser } from 'lucide-react';
import profilepic from '../../../assets/profile_pic.png'; // Adjust the path as necessary

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 rounded-b-lg">
      {/* Mobile menu button */}
      <button
        type="button"
        className="rounded-md p-2 text-gray-700 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Left Section */}

      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-800 hidden md:block">
          <span className="ml-2 text-sm font-normal text-gray-500">Administrator Panel</span>
        </h1>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center space-x-4">
        <div className="relative">
          {/* <BellDot className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" /> */}
          <BellDot className="w-6 h-6 cursor-pointer" />
        </div>

        <div className="relative flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
          {/* <CircleUser className="h-8 w-8 text-blue-600" /> */}
          <img src={profilepic} alt="Profile" className="w-8 h-8 rounded-full object-cover"
                />
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800">John Admin</span>
            <span className="text-gray-500">Administrator</span>
          </div>
        </div>

      </div>
    </header>
  );
}



