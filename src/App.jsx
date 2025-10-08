import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/Bookings/BookingsPage';
import OwnersPage from './pages/Owners/OwnersPage';
import StationsPage from './pages/Stations/StationsPage';
import UsersPage from './pages/Users/UsersPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import LoginPage from './components/common/LoginPage';
import SignUpPage from './components/common/SignUpPage';
import { SessionProvider } from './context/SessionContext';
import './style.css';

function App() {
  // Page state - initialize from localStorage or default to welcome
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'welcome';
  });
  
  // Auth state
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem('activeItem') || 'dashboard';
  });
  const [showSidebar, setShowSidebar] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage && savedPage !== 'welcome';
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('activeItem', activeItem);
  }, [activeItem]);

  // Navigation handlers
  const handleNavigate = (page) => {
    setCurrentPage(page);
    // List of pages that should show sidebar
    const pagesWithSidebar = ['dashboard', 'bookings', 'owners', 'stations', 'users', 'settings', 'reports'];
    if (pagesWithSidebar.includes(page)) {
      setShowSidebar(true);
      setActiveItem(page);
    } else {
      setShowSidebar(false);
    }
  };

  // Sidebar handlers
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleItemClick = (item) => {
    if (item === 'close') {
      setSidebarOpen(false);
    } else {
      setActiveItem(item);
      setCurrentPage(item);
      // Close mobile sidebar after selection
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    }
  };

  const handleLogout = () => {
    setCurrentPage('welcome');
    setShowSidebar(false);
    setActiveItem('dashboard');
    setShowLogin(false);
    setShowSignUp(false);
    // Clear localStorage on logout
    localStorage.removeItem('currentPage');
    localStorage.removeItem('activeItem');
  };

  // Auth handlers
  const handleLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLoginSubmit = (email, password) => {
    console.log('Login attempt:', email, password);
    // Simulate successful login
    setShowLogin(false);
    setCurrentPage('dashboard');
    setShowSidebar(true);
    setActiveItem('dashboard');
  };

  const handleSignUpSubmit = (userData) => {
    console.log('Sign up attempt:', userData);
    // Simulate successful sign up
    setShowSignUp(false);
    setCurrentPage('dashboard');
    setShowSidebar(true);
    setActiveItem('dashboard');
  };

  const handleSwitchToSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  // List of pages that should show navbar and sidebar
  const pagesWithLayout = ['dashboard', 'bookings', 'owners', 'stations', 'users', 'settings', 'reports'];

  // Render current page content
  const renderPageContent = () => {
    if (showLogin) {
      return (
        <LoginPage 
          onLogin={handleLoginSubmit}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      );
    }

    if (showSignUp) {
      return (
        <SignUpPage 
          onSignUp={handleSignUpSubmit}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
    }

    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onNavigate={handleNavigate} onLogin={handleLogin} onSignUp={handleSignUp} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'owners':
        return <OwnersPage />;
      case 'stations':
        return <StationsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return <WelcomePage onNavigate={handleNavigate} onLogin={handleLogin} onSignUp={handleSignUp} />;
    }
  };

  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen bg-gray-50/30">
          {/* Show navbar and sidebar on dashboard and other pages */}
          {pagesWithLayout.includes(currentPage) && (
            <>
              <Navbar 
                isLoggedIn={true}
                onLogin={() => {}}
                onSignUp={() => {}}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                currentPage={currentPage}
                onToggleSidebar={handleToggleSidebar}
                sidebarOpen={sidebarOpen}
              />
              
              <Sidebar 
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={handleSidebarToggle}
                activeItem={activeItem}
                onItemClick={handleItemClick}
                onLogout={handleLogout}
                showSidebar={showSidebar}
              />
            </>
          )}
          
          {/* Main content */}
          <main className={`
            ${pagesWithLayout.includes(currentPage) && showSidebar ? (sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''}
            ${pagesWithLayout.includes(currentPage) ? 'pt-16' : ''}
            min-h-screen flex flex-col
          `}>
            {renderPageContent()}
            
            {/* Version Info - Bottom Center */}
            <div className="flex justify-center pb-4 mt-auto">
              <div className="text-xs text-gray-500">
                EV Charging System v1.0
              </div>
            </div>
          </main>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;