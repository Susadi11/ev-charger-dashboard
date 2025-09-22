import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = ({ 
  isLoggedIn, 
  onLogin, 
  onSignUp, 
  onLogout, 
  onNavigate, 
  currentPage,
  onToggleSidebar,
  sidebarOpen
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setProfileDropdownOpen(false);
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button, Project title, and Navigation */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - only show when logged in */}
            {isLoggedIn && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}

            {/* Project title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EV</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                EV Charging System ERP
              </h1>
            </div>

            {/* Navigation links - only show when logged in */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center space-x-1 ml-8">
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 'home'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 'dashboard'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                {/* Login and Sign Up buttons */}
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={onSignUp}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
                >
                  Sign Up
                </button>
              </>
            ) : (
              /* Profile dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    Admin User
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-500 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Profile dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/50 backdrop-blur-md py-2 z-50">
                    <button
                      onClick={handleProfile}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
