import React from 'react';

const BookingsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Bookings Page</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Bookings Management
            </h2>
            <p className="text-gray-600 mb-6">
              Manage all charging station bookings, reservations, and scheduling.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Active Bookings</h3>
                <p className="text-3xl font-bold text-gray-800">24</p>
                <p className="text-sm text-gray-500">Currently active</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Pending</h3>
                <p className="text-3xl font-bold text-gray-800">12</p>
                <p className="text-sm text-gray-500">Awaiting confirmation</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Completed</h3>
                <p className="text-3xl font-bold text-gray-800">156</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
