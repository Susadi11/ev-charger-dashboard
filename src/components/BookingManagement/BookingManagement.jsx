import React, { useState } from 'react';
import { Search, Plus, Edit2, Zap, User } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import BookingModal from './BookingModal';

const calculateDuration = (start, end) => {
  const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
  const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
  const diffMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return minutes > 0 ? `${hours}.${minutes}h` : `${hours}h`;
};

const BookingManagement = ({ bookings: initialBookings, handleCancel, filter: initialFilter }) => {
  const [bookings, setBookings] = useState(initialBookings || [
    { id: 1, stationName: 'Downtown Charging Hub', ownerName: 'Rajesh Kumar', date: '2025-10-10', startTime: '09:00', endTime: '11:00', duration: '2h', status: 'confirmed' },
    { id: 2, stationName: 'Airport Station', ownerName: 'Nimal Silva', date: '2025-10-11', startTime: '14:00', endTime: '15:30', duration: '1.5h', status: 'pending' },
    { id: 3, stationName: 'Mall Parking', ownerName: 'Priya Fernando', date: '2025-10-09', startTime: '10:00', endTime: '12:00', duration: '2h', status: 'completed' },
    { id: 4, stationName: 'Downtown Charging Hub', ownerName: 'John Doe', date: '2025-10-08', startTime: '08:00', endTime: '09:00', duration: '1h', status: 'canceled' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState(initialFilter || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  
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
                  onClick={() => {
                    setBookings(bookings.map(b => b.id === row.id ? { ...b, status: 'canceled' } : b));
                    handleCancel && handleCancel(row.id);
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
        onSave={(bookingData) => {
          if (selectedBooking) {
            setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...bookingData, id: selectedBooking.id } : b));
          } else {
            const duration = calculateDuration(bookingData.startTime, bookingData.endTime);
            setBookings([...bookings, { ...bookingData, id: Date.now(), duration }]);
          }
        }}
      />
    </div>
  );
};

export default BookingManagement;