import React from 'react';

const StationsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Stations Page</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Charging Stations Management
            </h2>
            <p className="text-gray-600 mb-6">
              Monitor and manage all charging stations, their status, and performance.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Stations</h3>
                <p className="text-3xl font-bold text-gray-800">245</p>
                <p className="text-sm text-gray-500">All locations</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Online</h3>
                <p className="text-3xl font-bold text-gray-800">238</p>
                <p className="text-sm text-gray-500">Currently operational</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Maintenance</h3>
                <p className="text-3xl font-bold text-gray-800">7</p>
                <p className="text-sm text-gray-500">Under maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationsPage;
