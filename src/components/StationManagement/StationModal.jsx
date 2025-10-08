import React, { useState, useEffect } from 'react';
import { X, MapPin, Zap, Calendar, Clock } from 'lucide-react';

const StationModal = ({ isOpen, onClose, station, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    type: 'AC',
    slots: '',
    latitude: '',
    longitude: '',
    operatingHours: {
      open: '00:00',
      close: '23:59'
    },
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: 'operational'
  });

  const [errors, setErrors] = useState({});

  /**
   * Initialize form data when modal opens or station prop changes
   */
  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || '',
        location: station.location || '',
        address: station.address || '',
        type: station.type || 'AC',
        slots: station.slots || '',
        latitude: station.latitude || '',
        longitude: station.longitude || '',
        operatingHours: station.operatingHours || { open: '00:00', close: '23:59' },
        schedule: station.schedule || {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        status: station.status || 'operational'
      });
    } else {
      setFormData({
        name: '',
        location: '',
        address: '',
        type: 'AC',
        slots: '',
        latitude: '',
        longitude: '',
        operatingHours: { open: '00:00', close: '23:59' },
        schedule: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        status: 'operational'
      });
    }
    setErrors({});
  }, [station, isOpen]);

  /**
   * Validates form inputs
   * Returns true if all validations pass
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Station name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.slots || formData.slots < 1) newErrors.slots = 'Slots must be at least 1';
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Invalid latitude';
    }
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Invalid longitude';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  /**
   * Handles input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Toggles day availability in schedule
   */
  const handleScheduleChange = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [day]: !prev.schedule[day] }
    }));
  };

  /**
   * Handles operating hours changes
   */
  const handleTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: { ...prev.operatingHours, [field]: value }
    }));
  };

  if (!isOpen) return null;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {station ? 'Edit Station' : 'Add New Station'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {station ? 'Update station information and schedule' : 'Create a new charging station'}
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Downtown Charging Hub"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Colombo"
                />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 123 Main Street, Colombo 01"
              />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>

            {/* Station Type and Slots */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Zap className="inline mr-1" size={16} />
                  Charger Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="AC">AC Charger</option>
                  <option value="DC">DC Charger</option>
                  <option value="Both">AC & DC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Slots *
                </label>
                <input
                  type="number"
                  name="slots"
                  min="1"
                  value={formData.slots}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.slots ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 6"
                />
                {errors.slots && <p className="mt-1 text-xs text-red-500">{errors.slots}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* GPS Coordinates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline mr-1" size={16} />
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.latitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 6.9271"
                />
                {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                    errors.longitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 79.8612"
                />
                {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-1" size={16} />
                Operating Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Opening Time</label>
                  <input
                    type="time"
                    value={formData.operatingHours.open}
                    onChange={(e) => handleTimeChange('open', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={formData.operatingHours.close}
                    onChange={(e) => handleTimeChange('close', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-1" size={16} />
                Operating Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleScheduleChange(day)}
                    className={`py-2 px-1 text-xs font-medium rounded-lg transition-colors ${
                      formData.schedule[day]
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {station ? 'Update Station' : 'Create Station'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationModal;