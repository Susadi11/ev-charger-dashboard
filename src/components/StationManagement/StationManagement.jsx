import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Zap, MapPin } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import StationModal from './StationModal';

const StationManagement = ({ stations: initialStations, handleEdit, handleDelete }) => {
  const [stations, setStations] = useState(initialStations || [
    { id: 1, name: 'Downtown Charging Hub', location: 'Main Street, Colombo', type: 'DC', slots: 6, available: 4, status: 'operational' },
    { id: 2, name: 'Airport Station', location: 'Katunayake', type: 'AC', slots: 4, available: 2, status: 'operational' },
    { id: 3, name: 'Mall Parking', location: 'One Galle Face', type: 'Both', slots: 8, available: 0, status: 'maintenance' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { 
      header: 'Station Name', 
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <Zap className="mr-2 text-yellow-500" size={18} />
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Location', 
      accessor: 'location',
      render: (row) => (
        <div className="flex items-center text-gray-600">
          <MapPin className="mr-1" size={14} />
          {row.location}
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: 'type',
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
          {row.type}
        </span>
      )
    },
    { 
      header: 'Slots', 
      accessor: 'slots',
      render: (row) => `${row.available}/${row.slots} available`
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        const statusColors = {
          operational: 'bg-green-100 text-green-800',
          maintenance: 'bg-yellow-100 text-yellow-800',
          offline: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[row.status]}`}>
            {row.status}
          </span>
        );
      }
    }
  ];
  
  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Station Management</h1>
        <p className="text-gray-600">Monitor and manage all charging stations</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
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
            <Button onClick={() => { setSelectedStation(null); setIsModalOpen(true); }} icon={<Plus size={20} />}>
              Add Station
            </Button>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredStations}
          actions={(row) => (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setSelectedStation(row); setIsModalOpen(true); }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => {
                  if (handleDelete) {
                    handleDelete(row.id);
                  } else {
                    setStations(stations.filter(s => s.id !== row.id));
                  }
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>
      
      <StationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        station={selectedStation}
        onSave={(stationData) => {
          if (selectedStation) {
            setStations(stations.map(s => s.id === selectedStation.id ? { ...stationData, id: selectedStation.id, available: selectedStation.available } : s));
            handleEdit && handleEdit(stationData);
          } else {
            setStations([...stations, { ...stationData, id: Date.now(), available: stationData.slots }]);
          }
        }}
      />
    </div>
  );
};

export default StationManagement;