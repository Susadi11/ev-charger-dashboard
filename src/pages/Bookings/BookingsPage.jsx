import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Shield } from 'lucide-react';
import ReservationList from '../../components/booking/ReservationList';
import ReservationSummary from '../../components/booking/ReservationSummary';
import reservationService from '../../services/reservationService';

const BookingsPage = () => {
  const [showSummary, setShowSummary] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      const reservations = await reservationService.getReservations();
      const now = new Date();
      
      const stats = {
        total: reservations.length,
        upcoming: reservations.filter(r => new Date(r.startTime) > now && r.status !== 'Cancelled').length,
        completed: reservations.filter(r => new Date(r.endTime) < now && r.status === 'Confirmed').length,
        cancelled: reservations.filter(r => r.status === 'Cancelled').length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleViewSummary = (reservation) => {
    setSelectedReservation(reservation);
    setShowSummary(true);
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    setSelectedReservation(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Management</h1>
            <p className="text-gray-600">Monitor and manage EV charging station reservations</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-50 rounded-2xl">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">Operator View</span>
          </div>
        </div>

        {/* Advanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Reservations Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl backdrop-blur-sm border border-blue-200/30">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {stats.total}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Total Reservations</p>
                <p className="text-xs font-medium text-slate-500">All time bookings</p>
              </div>
            </div>
          </div>

          {/* Upcoming Reservations Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100/50 backdrop-blur-xl rounded-3xl border border-emerald-200/60 p-6 hover:shadow-xl hover:shadow-emerald-200/20 transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-2xl backdrop-blur-sm border border-emerald-200/30">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                    {stats.upcoming}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Upcoming</p>
                <p className="text-xs font-medium text-slate-500">Scheduled sessions</p>
              </div>
            </div>
          </div>

          {/* Completed Reservations Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100/50 backdrop-blur-xl rounded-3xl border border-amber-200/60 p-6 hover:shadow-xl hover:shadow-amber-200/20 transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-2xl backdrop-blur-sm border border-amber-200/30">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                    {stats.completed}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Completed</p>
                <p className="text-xs font-medium text-slate-500">Finished sessions</p>
              </div>
            </div>
          </div>

          {/* Cancelled Reservations Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-red-100/50 backdrop-blur-xl rounded-3xl border border-rose-200/60 p-6 hover:shadow-xl hover:shadow-rose-200/20 transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-rose-500/10 to-red-600/10 rounded-2xl backdrop-blur-sm border border-rose-200/30">
                  <Users className="w-6 h-6 text-rose-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-red-600 bg-clip-text text-transparent">
                    {stats.cancelled}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Cancelled</p>
                <p className="text-xs font-medium text-slate-500">Cancelled bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <ReservationList
            onViewSummary={handleViewSummary}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Reservation Summary Modal */}
        {showSummary && selectedReservation && (
          <ReservationSummary
            reservation={selectedReservation}
            onClose={handleSummaryClose}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
