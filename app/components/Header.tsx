"use client" 
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-3xl font-bold text-teal-600">
              Anafops Digital Solutions
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-4">
            <a href="/tasks" className="text-gray-300 font-bold text-1xl px-2 hover:text-blue-600">
              Home
            </a>
            <a href="#" className="text-gray-100 font-bold text-1xl px-2 hover:text-blue-600">
              About
            </a>
            <a href="/profile" className="text-gray-300 font-bold text-1xl px-2 hover:text-blue-600">
              Profile
            </a>
            <a href="#" className="text-gray-300 font-bold text-1xl px-2hover:text-blue-600">
              Contact
            </a>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block text-gray-800 hover:text-blue-600">
            Home
          </a>
          <a href="#" className="block text-gray-800 hover:text-blue-600">
            About
          </a>
          <a href="#" className="block text-gray-800 hover:text-blue-600">
            Services
          </a>
          <a href="#" className="block text-gray-800 hover:text-blue-600">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;
