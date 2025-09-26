import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Filter, Search, Eye, Trash2, X } from 'lucide-react';
import reservationService from '../../services/reservationService';

const ReservationList = ({ onViewSummary, refreshTrigger }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // upcoming, history
  const [dateFilter, setDateFilter] = useState('');
  const [stationFilter, setStationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableStations, setAvailableStations] = useState([]);

  useEffect(() => {
    loadReservations();
    loadStations();
  }, [refreshTrigger]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
      setError('Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStations = async () => {
    try {
      const stations = await reservationService.getAvailableStations();
      setAvailableStations(stations);
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
      return;
    }

    try {
      await reservationService.cancelReservation(id);
      await loadReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return '✓';
      case 'Pending':
        return '⏳';
      case 'Cancelled':
        return '✕';
      default:
        return '?';
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (reservation) => {
    return new Date(reservation.startTime) > new Date();
  };

  const canCancelReservation = (reservation) => {
    const now = new Date();
    const startTime = new Date(reservation.startTime);
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    return startTime > twelveHoursFromNow && reservation.status !== 'Cancelled';
  };

  const filteredReservations = reservations.filter(reservation => {
    // Filter by type (upcoming vs history)
    if (filter === 'upcoming' && !isUpcoming(reservation)) return false;
    if (filter === 'history' && isUpcoming(reservation)) return false;
    
    // Filter by date
    if (dateFilter) {
      const reservationDate = new Date(reservation.startTime).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      if (reservationDate !== filterDate) return false;
    }
    
    // Filter by station
    if (stationFilter && reservation.stationId !== stationFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        reservation.stationName.toLowerCase().includes(searchLower) ||
        reservation.id.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadReservations}
          className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-6">
        {[
          { key: 'upcoming', label: 'Upcoming Reservations' },
          { key: 'history', label: 'Booking History' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Station Filter */}
          <div>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Stations</option>
              {availableStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(dateFilter || stationFilter || searchTerm) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setDateFilter('');
                setStationFilter('');
                setSearchTerm('');
              }}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Modern Reservations Table */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No reservations yet' : 
             filter === 'upcoming' ? 'No upcoming reservations' : 
             'No past reservations'}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'Create your first reservation to get started' : 
             filter === 'upcoming' ? 'You have no upcoming reservations' : 
             'You have no past reservations'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-3">Station</div>
                <div className="col-span-2">Start Time</div>
                <div className="col-span-2">End Time</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredReservations.map((reservation, index) => {
                const startTime = new Date(reservation.startTime);
                const endTime = new Date(reservation.endTime);
                const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
                
                return (
                  <div
                    key={reservation.id}
                    className={`px-6 py-4 hover:bg-gray-50/50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Station */}
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-50 rounded-lg mr-3">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reservation.stationName}</p>
                            <p className="text-xs text-gray-500">Charging Station</p>
                          </div>
                        </div>
                      </div>

                      {/* Start Time */}
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {startTime.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {startTime.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* End Time */}
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {endTime.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {endTime.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {duration}h
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          <span className="mr-1">{getStatusIcon(reservation.status)}</span>
                          {reservation.status}
                        </span>
                      </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex items-center justify-center space-x-1">
                        {canCancelReservation(reservation) && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Cancel Reservation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => onViewSummary?.(reservation)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          title="View Details & QR Code"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredReservations.map((reservation) => {
              const startTime = new Date(reservation.startTime);
              const endTime = new Date(reservation.endTime);
              const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
              
              return (
                <div
                  key={reservation.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{reservation.stationName}</p>
                        <p className="text-xs text-gray-500">Charging Station</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      <span className="mr-1">{getStatusIcon(reservation.status)}</span>
                      {reservation.status}
                    </span>
                  </div>

                  {/* Time Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Start</p>
                        <p className="text-xs text-gray-500">
                          {startTime.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">End</p>
                        <p className="text-xs text-gray-500">
                          {endTime.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Duration and Actions */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {duration}h duration
                    </span>
                    <div className="flex items-center space-x-2">
                      {canCancelReservation(reservation) && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Cancel Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onViewSummary?.(reservation)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="View Details & QR Code"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
