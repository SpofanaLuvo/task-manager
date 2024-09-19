"use client";
import { useState } from 'react';
import { FiMenu, FiX, FiLogOut, FiHome, FiUser, FiInfo, FiMail } from 'react-icons/fi';
import useAuthStore from '@/store/authStore';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/tasks" className="text-3xl font-bold text-teal-600">
              Anafops Digital Solutions
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-4 items-center">
            <a href="/tasks" className="text-gray-300 font-bold text-xl px-2 hover:text-blue-600 flex items-center">
              <FiHome className="mr-1" />
              Home
            </a>
            <a href="#" className="text-gray-100 font-bold text-xl px-2 hover:text-blue-600 flex items-center">
              <FiInfo className="mr-1" />
              About
            </a>
            <a href="/profile" className="text-gray-300 font-bold text-xl px-2 hover:text-blue-600 flex items-center">
              <FiUser className="mr-1" />
              Profile
            </a>
            <a href="#" className="text-gray-300 font-bold text-xl px-2 hover:text-blue-600 flex items-center">
              <FiMail className="mr-1" />
              Contact
            </a>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 text-gray-300 font-bold text-xl px-2 hover:text-red-600 flex items-center"
            >
              <FiLogOut className="mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-3 space-y-1">
          <a href="/" className="block text-gray-300 hover:text-blue-600 flex items-center">
            <FiHome className="mr-1" />
            Home
          </a>
          <a href="#" className="block text-gray-300 hover:text-blue-600 flex items-center">
            <FiInfo className="mr-1" />
            About
          </a>
          <a href="/profile" className="block text-gray-300 hover:text-blue-600 flex items-center">
            <FiUser className="mr-1" />
            Profile
          </a>
          <a href="#" className="block text-gray-300 hover:text-blue-600 flex items-center">
            <FiMail className="mr-1" />
            Contact
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left block text-gray-300 hover:text-red-600 flex items-center"
          >
            <FiLogOut className="mr-1" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
