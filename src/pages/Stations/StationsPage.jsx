import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Zap, MapPin, Filter } from 'lucide-react';
import StationModal from '../../components/StationManagement/StationModal';
import StationDetailsView from '../../components/StationManagement/StationDetailsView';

const StationsPage = () => {
  // Sample data - replace with API calls
  const [stations, setStations] = useState([
    { 
      id: 1, 
      name: 'Downtown Charging Hub', 
      location: 'Colombo', 
      address: 'Main Street, Colombo 01',
      type: 'DC', 
      slots: 6, 
      available: 4, 
      status: 'operational',
      latitude: '6.9271',
      longitude: '79.8612',
      operatingHours: { open: '00:00', close: '23:59' },
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      }
    },
    { 
      id: 2, 
      name: 'Airport Station', 
      location: 'Katunayake', 
      address: 'Bandaranaike International Airport',
      type: 'AC', 
      slots: 4, 
      available: 2, 
      status: 'operational',
      latitude: '7.1807',
      longitude: '79.8841',
      operatingHours: { open: '06:00', close: '22:00' },
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false
      }
    },
    { 
      id: 3, 
      name: 'Mall Parking', 
      location: 'One Galle Face', 
      address: 'One Galle Face Mall, Colombo 02',
      type: 'Both', 
      slots: 8, 
      available: 0, 
      status: 'maintenance',
      latitude: '6.9318',
      longitude: '79.8434',
      operatingHours: { open: '10:00', close: '22:00' },
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true
      }
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  /**
   * Calculate statistics from stations data
   */
  const stats = {
    total: stations.length,
    operational: stations.filter(s => s.status === 'operational').length,
    maintenance: stations.filter(s => s.status === 'maintenance').length,
    offline: stations.filter(s => s.status === 'offline').length
  };

  /**
   * Filter stations based on search term and filters
   */
  const filteredStations = stations.filter(station => {
    const matchesSearch = 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || station.status === filterStatus;
    const matchesType = filterType === 'all' || station.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  /**
   * Handle saving station (create or update)
   */
  const handleSaveStation = (stationData) => {
    if (selectedStation) {
      // Update existing station
      setStations(stations.map(s => 
        s.id === selectedStation.id 
          ? { ...stationData, id: selectedStation.id, available: selectedStation.available } 
          : s
      ));
    } else {
      // Create new station
      const newStation = {
        ...stationData,
        id: Date.now(),
        available: stationData.slots
      };
      setStations([...stations, newStation]);
    }
    setIsModalOpen(false);
    setSelectedStation(null);
  };

  /**
   * Handle deleting a station
   */
  const handleDeleteStation = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    
    // Check if station has active bookings (in real app, check via API)
    const hasActiveBookings = station.available < station.slots;
    
    if (hasActiveBookings) {
      alert('Cannot delete station with active bookings. Please cancel all bookings first.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${station.name}"?`)) {
      setStations(stations.filter(s => s.id !== stationId));
    }
  };

  /**
   * Handle opening edit modal
   */
  const handleEditClick = (station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  /**
   * Handle opening details view
   */
  const handleViewClick = (station) => {
    setSelectedStation(station);
    setIsDetailsOpen(true);
  };

  /**
   * Handle opening add modal
   */
  const handleAddClick = () => {
    setSelectedStation(null);
    setIsModalOpen(true);
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status) => {
    const statusColors = {
      operational: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      offline: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  /**
   * Get type badge styling
   */
  const getTypeBadge = (type) => {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
        {type}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Station Management</h1>
        <p className="text-gray-600">Monitor and manage all charging stations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Stations</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">All locations</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Operational</h3>
          <p className="text-3xl font-bold text-green-600">{stats.operational}</p>
          <p className="text-xs text-gray-500 mt-1">Currently active</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Maintenance</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.maintenance}</p>
          <p className="text-xs text-gray-500 mt-1">Under repair</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Offline</h3>
          <p className="text-3xl font-bold text-red-600">{stats.offline}</p>
          <p className="text-xs text-gray-500 mt-1">Not available</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              
              {/* Filters */}
              <div className="flex space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="AC">AC</option>
                  <option value="DC">DC</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
            
            {/* Add Button */}
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <Plus className="mr-2" size={20} />
              Add Station
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Station Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No stations found
                  </td>
                </tr>
              ) : (
                filteredStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Zap className="mr-2 text-yellow-500" size={18} />
                        <span className="font-medium text-gray-900">{station.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-1" size={14} />
                        {station.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(station.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {station.available}/{station.slots} available
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(station.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewClick(station)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditClick(station)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit Station"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteStation(station.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Station"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modals */}
      <StationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStation(null);
        }}
        station={selectedStation}
        onSave={handleSaveStation}
      />

      <StationDetailsView
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedStation(null);
        }}
        station={selectedStation}
      />
    </div>
  );
};

export default StationsPage;