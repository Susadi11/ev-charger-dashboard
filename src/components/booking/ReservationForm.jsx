import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import reservationService from '../../services/reservationService';

const ReservationForm = ({ onReservationCreated, onCancel, editReservation = null }) => {
  const [formData, setFormData] = useState({
    stationId: '',
    startTime: '',
    endTime: '',
  });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stations on component mount
  useEffect(() => {
    loadStations();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (editReservation) {
      setFormData({
        stationId: editReservation.stationId,
        startTime: editReservation.startTime,
        endTime: editReservation.endTime,
      });
    }
  }, [editReservation]);

  const loadStations = async () => {
    try {
      setLoading(true);
      const availableStations = await reservationService.getAvailableStations();
      setStations(availableStations);
    } catch (error) {
      console.error('Error loading stations:', error);
      setErrors({ general: 'Failed to load stations. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.stationId) {
      newErrors.stationId = 'Please select a charging station';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Please select a start time';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Please select an end time';
    }

    // Validate time constraints
    if (formData.startTime && formData.endTime) {
      const validation = reservationService.validateReservationTime(
        formData.startTime,
        formData.endTime
      );
      
      if (!validation.isValid) {
        newErrors.timeValidation = validation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (editReservation) {
        // Update existing reservation
        await reservationService.updateReservation(editReservation.id, {
          startTime: formData.startTime,
          endTime: formData.endTime,
        });
      } else {
        // Create new reservation
        await reservationService.createReservation(formData);
      }
      
      onReservationCreated?.();
    } catch (error) {
      console.error('Error saving reservation:', error);
      setErrors({ general: 'Failed to save reservation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    return twelveHoursFromNow.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return sevenDaysFromNow.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          {editReservation ? 'Modify Reservation' : 'Create Reservation'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <span className="text-red-700">{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Station Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4 inline mr-2" />
            Charging Station
          </label>
          <select
            name="stationId"
            value={formData.stationId}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.stationId ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            disabled={loading}
          >
            <option value="">Select a station</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} - {station.location} ({station.chargingSpeed}) - {station.availableSlots || 'N/A'} slots available
              </option>
            ))}
          </select>
          {errors.stationId && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.stationId}
            </p>
          )}
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Time
            </label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              min={getMinDateTime()}
              max={getMaxDateTime()}
              className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.startTime ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.startTime && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.startTime}
              </p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Clock className="w-4 h-4 inline mr-2" />
              End Time
            </label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              min={formData.startTime || getMinDateTime()}
              max={getMaxDateTime()}
              className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.endTime ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.endTime && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.endTime}
              </p>
            )}
          </div>
        </div>

        {/* Time Validation Error */}
        {errors.timeValidation && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
            <span className="text-amber-700">{errors.timeValidation}</span>
          </div>
        )}

        {/* Validation Info */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Reservation Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Must be at least 12 hours in advance
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Cannot be more than 7 days in advance
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Maximum duration: 8 hours
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {editReservation ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              editReservation ? 'Update Reservation' : 'Create Reservation'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
