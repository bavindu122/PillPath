import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { BellDot, Menu,LogOutIcon } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(true);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

     const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const handleMouseEnter = () => {
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        setShowDropdown(false);
    };

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300 relative">
            {/* Logo */}
            <img 
                className="w-32 sm:w-36 md:w-44 cursor-pointer" 
                src={assets.logo1} 
                alt="logo" 
                onClick={() => navigate('/')}
            />

            {/* Desktop Navigation (hidden on mobile) */}
            <div className="hidden md:flex border border-gray-400 rounded-full px-4 py-1 lg:px-6 lg:py-2">
                <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-medium text-gray-700 text-sm whitespace-nowrap">
                    <NavLink 
                        to='/' 
                        className={({ isActive }) =>
                            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'text-white border bg-pButton'
                                    : 'text-gray-700 hover:text-white hover:bg-pButton'
                            }`
                        }
                    >
                        <li className="py-1">Home</li>
                    </NavLink>
                    <NavLink 
                        to='/services' 
                        className={({ isActive }) =>
                            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'text-white border bg-pButton'
                                    : 'text-gray-700 hover:text-white hover:bg-pButton'
                            }`
                        }
                    >
                        <li className="py-1">Services</li>
                    </NavLink>
                    <NavLink 
                        to='/otc' 
                        className={({ isActive }) =>
                            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'text-white border bg-pButton'
                                    : 'text-gray-700 hover:text-white hover:bg-pButton'
                            }`
                        }
                    >
                        <li className="py-1">OTC Store</li>
                    </NavLink>
                    <NavLink 
                        to='/about' 
                        className={({ isActive }) =>
                            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'text-white border bg-pButton'
                                    : 'text-gray-700 hover:text-white hover:bg-pButton'
                            }`
                        }
                    >
                        <li className="py-1">About Us</li>
                    </NavLink>
                    <NavLink 
                        to='/contact' 
                        className={({ isActive }) =>
                            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
                                isActive
                                    ? 'text-white border bg-pButton'
                                    : 'text-gray-700 hover:text-white hover:bg-pButton'
                            }`
                        }
                    >
                        <li className="py-1">Contact</li>
                    </NavLink>
                </ul>
            </div>
            
            {/* Desktop Account Section */}
            <div className="hidden md:flex items-center gap-4">
                {token ? (
                    <div className="flex items-center gap-4" onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                        
                        <BellDot className="w-6 h-6 cursor-pointer" />
                        <img 
                            src={assets.profile_pic} 
                            alt="profile" 
                            className="w-10 h-10 rounded-full cursor-pointer"
                            onClick={toggleDropdown}
                        />
                        <div className={`absolute top-0 right-0 mt-2 pt-14  text-base font-medium text-gray-600 z-50 transition-all duration-200 ${showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p className='cursor-pointer hover:border-b-4 hover:border-pButton'>Option 1</p>
                                <p className='cursor-pointer hover:border-b-4 hover:border-pButton'>Option 2</p>
                                <p onClick={() => setToken(false)} className='cursor-pointer hover:border-b-4 hover:border-pButton'><span>Logout</span></p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-pButton text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-light hover:bg-pButtonH whitespace-nowrap"
                    >
                        Create account
                    </button>
                )}
            </div>

            {/* Mobile Section  */}
            <div className="md:hidden flex items-center gap-4">
                {token ? (
                    <img 
                        src={assets.profile_pic} 
                        alt="profile" 
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="bg-pButton text-white px-4 py-2 rounded-full font-light hover:bg-pButtonH whitespace-nowrap text-sm"
                    >
                        Create account
                    </button>
                )}
                <Menu 
                    className="w-6 h-6 cursor-pointer" 
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                />
            </div>

            {/* shown when menu button is clicked */}
            {showMobileMenu && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg z-50 p-4">
                    <ul className="flex flex-col gap-3 font-medium text-gray-700">
                        
                        <NavLink 
                            to='/' 
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'text-white border bg-pButton'
                                        : 'text-gray-700 hover:text-white hover:bg-pButton'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <li>Home</li>
                        </NavLink>
                        <NavLink 
                            to='/services' 
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'text-white border bg-pButton'
                                        : 'text-gray-700 hover:text-white hover:bg-pButton'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <li>Services</li>
                        </NavLink>
                        <NavLink 
                            to='/otc' 
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'text-white border bg-pButton'
                                        : 'text-gray-700 hover:text-white hover:bg-pButton'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <li>OTC Store</li>
                        </NavLink>
                        <NavLink 
                            to='/about' 
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'text-white border bg-pButton'
                                        : 'text-gray-700 hover:text-white hover:bg-pButton'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <li>About Us</li>
                        </NavLink>
                        <NavLink 
                            to='/contact' 
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                        ? 'text-white border bg-pButton'
                                        : 'text-gray-700 hover:text-white hover:bg-pButton'
                                }`
                            }
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <li>Contact</li>
                        </NavLink>
                        {token && (
                            <div className="flex items-center gap-3 px-4 py-2">
                                <img 
                                    src={assets.profile_pic} 
                                    alt="profile" 
                                    className="w-8 h-8 rounded-full"
                                    
                                />
                                <span className="hover:text-pButton cursor-pointer">Profile</span>
                            </div>
                        )}
                        {token && (
                            <div className="flex items-center gap-3 px-4 py-2">
                                <BellDot className="w-5 h-5" />
                                <span className="hover:text-pButton cursor-pointer">Notifications</span>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;