import React from 'react';
import { X, MapPin, Zap, Calendar, Clock, Map, CheckCircle, XCircle } from 'lucide-react';

const StationDetailsView = ({ isOpen, onClose, station }) => {
  if (!isOpen || !station) return null;

  /**
   * Get status badge styling based on station status
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      operational: { bg: 'bg-green-100', text: 'text-green-800', label: 'Operational' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Under Maintenance' },
      offline: { bg: 'bg-red-100', text: 'text-red-800', label: 'Offline' }
    };
    
    const config = statusConfig[status] || statusConfig.operational;
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  /**
   * Get type badge styling based on charger type
   */
  const getTypeBadge = (type) => {
    const typeConfig = {
      AC: { bg: 'bg-blue-100', text: 'text-blue-800' },
      DC: { bg: 'bg-purple-100', text: 'text-purple-800' },
      Both: { bg: 'bg-indigo-100', text: 'text-indigo-800' }
    };
    
    const config = typeConfig[type] || typeConfig.AC;
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
        {type}
      </span>
    );
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Zap className="mr-2 text-yellow-500" size={28} />
                  {station.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <MapPin className="mr-1" size={14} />
                  {station.location}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {getStatusBadge(station.status)}
                {getTypeBadge(station.type)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Map className="mr-2 text-gray-700" size={20} />
                Location Details
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Address</label>
                  <p className="text-sm text-gray-900">{station.address || 'N/A'}</p>
                </div>
                {(station.latitude || station.longitude) && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
                      <p className="text-sm text-gray-900">{station.latitude || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
                      <p className="text-sm text-gray-900">{station.longitude || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Slot Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Zap className="mr-2 text-gray-700" size={20} />
                Charging Slots
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Slots</span>
                  <span className="text-2xl font-bold text-gray-900">{station.slots}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available Slots</span>
                  <span className="text-2xl font-bold text-green-600">{station.available || station.slots}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${((station.available || station.slots) / station.slots) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(((station.available || station.slots) / station.slots) * 100)}% available
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="mr-2 text-gray-700" size={20} />
                Operating Hours
              </h4>
              <div className="space-y-2">
                {station.operatingHours ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Opening Time</span>
                      <span className="text-sm font-medium text-gray-900">{station.operatingHours.open}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Closing Time</span>
                      <span className="text-sm font-medium text-gray-900">{station.operatingHours.close}</span>
                    </div>
                    {station.operatingHours.open === '00:00' && station.operatingHours.close === '23:59' && (
                      <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-xs text-green-800 font-medium">24/7 Operation</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Operating hours not specified</p>
                )}
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="mr-2 text-gray-700" size={20} />
                Weekly Schedule
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const isAvailable = station.schedule ? station.schedule[day] : true;
                  return (
                    <div key={day} className="text-center">
                      <div className={`p-2 rounded-lg ${
                        isAvailable 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-red-100 border border-red-300'
                      }`}>
                        {isAvailable ? (
                          <CheckCircle className="mx-auto text-green-600" size={16} />
                        ) : (
                          <XCircle className="mx-auto text-red-600" size={16} />
                        )}
                      </div>
                      <p className={`text-xs mt-1 font-medium ${
                        isAvailable ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {dayLabels[index]}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="mr-1 text-green-600" size={14} />
                  <span>Open</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="mr-1 text-red-600" size={14} />
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetailsView;