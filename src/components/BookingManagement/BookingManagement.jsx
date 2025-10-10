import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Zap, User } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import BookingModal from './BookingModal';
import reservationService from '../../services/reservationService';

const calculateDuration = (start, end) => {
  const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
  const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
  const diffMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return minutes > 0 ? `${hours}.${minutes}h` : `${hours}h`;
};

const BookingManagement = ({ bookings: initialBookings, handleCancel, filter: initialFilter }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState(initialFilter || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load bookings from API on component mount
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get all reservations (admin view) or user reservations
      const reservations = await reservationService.getAllReservations();
      
      // Transform reservation data to booking format
      const transformedBookings = reservations.map(reservation => {
        const startDate = new Date(reservation.startTime);
        const endDate = new Date(reservation.endTime);
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
        
        return {
          id: reservation.id,
          stationName: reservation.stationName || 'Unknown Station',
          ownerName: reservation.nic || 'Unknown User',
          date: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5),
          duration: `${duration}h`,
          status: reservation.status.toLowerCase()
        };
      });
      
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Failed to load bookings. Please try again.');
      // Fallback to initial bookings if provided
      if (initialBookings) {
        setBookings(initialBookings);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const columns = [
    { 
      header: 'Station', 
      accessor: 'stationName',
      render: (row) => (
        <div className="flex items-center">
          <Zap className="mr-2 text-yellow-500" size={18} />
          <span className="font-medium">{row.stationName}</span>
        </div>
      )
    },
    { 
      header: 'Owner', 
      accessor: 'ownerName',
      render: (row) => (
        <div className="flex items-center text-gray-600">
          <User className="mr-1" size={14} />
          {row.ownerName}
        </div>
      )
    },
    { 
      header: 'Date & Time', 
      accessor: 'date',
      render: (row) => (
        <div>
          <div className="font-medium">{row.date}</div>
          <div className="text-sm text-gray-500">{row.startTime} - {row.endTime}</div>
        </div>
      )
    },
    { header: 'Duration', accessor: 'duration' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const statusColors = {
          confirmed: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          completed: 'bg-blue-100 text-blue-800',
          canceled: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[row.status]}`}>
            {row.status}
          </span>
        );
      }
    }
  ];
  
  const filteredBookings = bookings
    .filter(booking => filter === 'all' || booking.status === filter)
    .filter(booking =>
      booking.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Monitor and manage charging station reservations</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Monitor and manage charging station reservations</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadBookings}
            className="bg-red-100 text-red-800 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
        <p className="text-gray-600">Monitor and manage charging station reservations</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              
              <Button onClick={() => { setSelectedBooking(null); setIsModalOpen(true); }} icon={<Plus size={20} />}>
                Add Booking
              </Button>
            </div>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredBookings}
          actions={(row) => (
            <div className="flex justify-end space-x-2">
              {row.status === 'confirmed' && (
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      try {
                        await reservationService.cancelReservation(row.id);
                        await loadBookings(); // Reload bookings after cancellation
                        handleCancel && handleCancel(row.id);
                      } catch (error) {
                        console.error('Error cancelling booking:', error);
                        alert('Failed to cancel booking. Please try again.');
                      }
                    }
                  }}
                  className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => { setSelectedBooking(row); setIsModalOpen(true); }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        />
      </div>
      
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        onSave={async (bookingData) => {
          try {
            if (selectedBooking) {
              // Update existing booking
              await reservationService.updateReservation(selectedBooking.id, {
                startTime: `${bookingData.date}T${bookingData.startTime}:00Z`,
                endTime: `${bookingData.date}T${bookingData.endTime}:00Z`,
              });
            } else {
              // Create new booking
              await reservationService.createReservation({
                stationId: bookingData.stationId,
                startTime: `${bookingData.date}T${bookingData.startTime}:00Z`,
                endTime: `${bookingData.date}T${bookingData.endTime}:00Z`,
              });
            }
            
            // Reload bookings after save
            await loadBookings();
            setIsModalOpen(false);
          } catch (error) {
            console.error('Error saving booking:', error);
            alert('Failed to save booking. Please try again.');
          }
        }}
      />
    </div>
  );
};

export default BookingManagement;