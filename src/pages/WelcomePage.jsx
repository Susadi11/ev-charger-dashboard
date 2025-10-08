import React, { useState } from 'react';
import { Users, MapPin, Calendar, Settings, BarChart3, Shield, ArrowRight, Sparkles } from 'lucide-react';

const WelcomePage = ({ onNavigate, onLogin, onSignUp }) => {
  const [showAuthButtons, setShowAuthButtons] = useState(false);
  const features = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Comprehensive user administration with role-based access control and permissions management.'
    },
    {
      icon: MapPin,
      title: 'Station Management',
      description: 'Monitor and manage EV charging stations across multiple locations with real-time status updates.'
    },
    {
      icon: Calendar,
      title: 'Booking System',
      description: 'Advanced scheduling system for charging sessions with automated notifications and reminders.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Detailed insights and analytics on usage patterns, revenue, and operational efficiency.'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with audit trails and compliance monitoring for all operations.'
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Flexible configuration options to customize the system according to your business needs.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-300/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">EV</span>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              EV Charging
              <br />
              <span className="text-gray-700">System</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              The most elegant and powerful ERP system for electric vehicle charging infrastructure management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="group bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                </span>
              </button>
              <button 
                onClick={() => setShowAuthButtons(!showAuthButtons)}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-4 px-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 bg-white/80 backdrop-blur-sm"
              >
                Sign In
              </button>
            </div>

            {/* Auth Buttons - Conditional */}
            {showAuthButtons && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button 
                  onClick={() => {
                    onLogin && onLogin();
                    setShowAuthButtons(false);
                  }}
                  className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow-sm"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    onSignUp && onSignUp();
                    setShowAuthButtons(false);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything you need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            A complete suite of tools designed for modern EV charging infrastructure management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-200/30 hover:shadow-xl hover:bg-white/80 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">500+</div>
              <div className="text-gray-600 font-medium">Active Stations</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">10K+</div>
              <div className="text-gray-600 font-medium">Daily Sessions</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-16 text-center text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
              Join thousands of businesses already using our system to streamline 
              their EV charging operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="group bg-white text-gray-900 hover:bg-gray-100 font-medium py-4 px-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                </span>
              </button>
              <button 
                onClick={() => setShowAuthButtons(!showAuthButtons)}
                className="border border-white/20 hover:border-white/40 text-white hover:bg-white/10 font-medium py-4 px-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-800 backdrop-blur-sm"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
