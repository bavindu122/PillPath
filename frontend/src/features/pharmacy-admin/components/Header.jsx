import React from 'react';
import { BellDot, CircleUser } from 'lucide-react';
import { assets } from '../../../assets/assets'; // Adjust the path as necessary

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
          Pillpath <span className="ml-2 text-sm font-normal text-gray-500">Administrator Panel</span>
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
          <img src={"assets.profile_pic"}
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






// import React, { useState, useEffect } from "react";
// import { assets } from "../assets/assets";
// import { NavLink, useNavigate } from "react-router-dom";
// import { BellDot, Menu, LogOutIcon } from "lucide-react";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(true);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // Track scroll position for styling changes
//   useEffect(() => {
//     const handleScroll = () => {
//       const isScrolled = window.scrollY > 10;
//       if (isScrolled !== scrolled) {
//         setScrolled(isScrolled);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [scrolled]);

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleMouseEnter = () => {
//     setShowDropdown(true);
//   };

//   const handleMouseLeave = () => {
//     setShowDropdown(false);
//   };

//   return (
//     <>
//       {/* Spacer div to prevent content from jumping when navbar becomes fixed */}
//       <div className="h-[72px] md:h-[80px]"></div>

//       <div
//         className={`fixed top-0 left-0 right-0 flex items-center justify-between text-sm py-4 z-50 transition-all duration-300 ${
//           scrolled
//             ? "bg-white/70 backdrop-blur-md shadow-md"
//             : "bg-white/90 backdrop-blur-sm"
//         }`}
//       >
//         {/* Logo */}
//         <img
//           className="w-32 sm:w-36 md:w-44 cursor-pointer ml-4 md:ml-6"
//           src={assets.logo1}
//           alt="logo"
//           onClick={() => navigate("/")}
//         />

//         {/* Desktop Navigation (hidden on mobile) */}
//         <div className="hidden md:flex border border-gray-400 rounded-full px-4 py-1 lg:px-6 lg:py-2">
//           <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-medium text-gray-700 text-sm whitespace-nowrap">
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
//                   isActive
//                     ? "text-white border bg-pButton"
//                     : "text-gray-700 hover:text-white hover:bg-pButton"
//                 }`
//               }
//             >
//               <li className="py-1">Home</li>
//             </NavLink>
//             {/* Other navigation links remain unchanged */}
//             <NavLink
//               to="/services"
//               className={({ isActive }) =>
//                 `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
//                   isActive
//                     ? "text-white border bg-pButton"
//                     : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
//                 }`
//               }
//             >
//               <li className="py-1">Services</li>
//             </NavLink>
//             <NavLink
//               to="/otc"
//               className={({ isActive }) =>
//                 `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
//                   isActive
//                     ? "text-white border bg-pButton"
//                     : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
//                 }`
//               }
//             >
//               <li className="py-1">OTC Store</li>
//             </NavLink>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
//                   isActive
//                     ? "text-white border bg-pButton"
//                     : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
//                 }`
//               }
//             >
//               <li className="py-1">About Us</li>
//             </NavLink>
//             <NavLink
//               to="/contact"
//               className={({ isActive }) =>
//                 `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
//                   isActive
//                     ? "text-white border bg-pButton"
//                     : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
//                 }`
//               }
//             >
//               <li className="py-1">Contact</li>
//             </NavLink>
//           </ul>
//         </div>

//         {/* Desktop Account Section */}
//         <div className="hidden md:flex items-center gap-4 mr-6">
//           {token ? (
//             <div
//               className="flex items-center gap-4"
//               onMouseEnter={handleMouseEnter}
//               onMouseLeave={handleMouseLeave}
//             >
//               <BellDot className="w-6 h-6 cursor-pointer" />
//               <img
//                 src={assets.profile_pic}
//                 alt="profile"
//                 className="w-10 h-10 rounded-full cursor-pointer"
//                 onClick={toggleDropdown}
//               />
//               <div
//                 className={`absolute top-0 right-0 mt-16 mr-6 text-base font-medium text-gray-600 z-50 transition-all duration-200 ${
//                   showDropdown ? "opacity-100 visible" : "opacity-0 invisible"
//                 }`}
//               >
//                 <div className="min-w-48 bg-white rounded-lg shadow-lg flex flex-col gap-4 p-4">
//                   <p className="cursor-pointer hover:text-pButton">Profile</p>
//                   <p className="cursor-pointer hover:text-pButton">Settings</p>
//                   <div className="border-t border-gray-200 pt-2">
//                     <p
//                       onClick={() => setToken(false)}
//                       className="cursor-pointer hover:text-pButton flex items-center gap-2"
//                     >
//                       <LogOutIcon size={16} />
//                       <span>Logout</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-pButton text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-light hover:bg-pButtonH whitespace-nowrap"
//             >
//               Create account
//             </button>
//           )}
//         </div>

//         {/* Mobile Section  */}
//         <div className="md:hidden flex items-center gap-4 mr-4">
//           {token ? (
//             <img
//               src={assets.profile_pic}
//               alt="profile"
//               className="w-8 h-8 rounded-full"
//             />
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-pButton text-white px-4 py-2 rounded-full font-light hover:bg-pButtonH whitespace-nowrap text-sm"
//             >
//               Create account
//             </button>
//           )}
//           <Menu
//             className="w-6 h-6 cursor-pointer"
//             onClick={() => setShowMobileMenu(!showMobileMenu)}
//           />
//         </div>

//         {/* shown when menu button is clicked */}
//         {showMobileMenu && (
//           <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 p-4">
//             <ul className="flex flex-col gap-3 font-medium text-gray-700">
//               {/* Mobile menu links remain unchanged */}
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `px-4 py-2 rounded-lg transition-all duration-300 ${
//                     isActive
//                       ? "text-white border bg-pButton"
//                       : "text-gray-700 hover:text-white hover:bg-pButton"
//                   }`
//                 }
//                 onClick={() => setShowMobileMenu(false)}
//               >
//                 <li>Home</li>
//               </NavLink>
//               {/* Other mobile navigation links */}
//               {/* ... */}
//             </ul>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Navbar;
