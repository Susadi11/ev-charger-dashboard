import React, { useState } from 'react';
import { Search, Plus, Edit2, User, Trash2, Users, UserCheck, UserX } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import OwnerModal from './OwnerModal';

const OwnerManagement = ({ owners: initialOwners, handleEdit, toggleStatus }) => {
  const [owners, setOwners] = useState(initialOwners || [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', nic: '912345678V', phone: '+94771234567', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Nimal Silva', email: 'nimal@example.com', nic: '901234567V', phone: '+94772345678', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Priya Fernando', email: 'priya@example.com', nic: '895678901V', phone: '+94773456789', status: 'inactive', joinDate: '2024-03-10' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <User className="mr-2 text-gray-400" size={18} />
          <span className="text-sm font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Email', 
      accessor: 'email',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.email}</span>
      )
    },
    { 
      header: 'NIC', 
      accessor: 'nic',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.nic}</span>
      )
    },
    { 
      header: 'Phone', 
      accessor: 'phone',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.phone}</span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Join Date', 
      accessor: 'joinDate',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.joinDate}</span>
      )
    }
  ];
  
  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeOwners = owners.filter(o => o.status === 'active').length;
  const inactiveOwners = owners.filter(o => o.status === 'inactive').length;

  const handleToggleStatus = (ownerId) => {
    setOwners(owners.map(owner => 
      owner.id === ownerId 
        ? { ...owner, status: owner.status === 'active' ? 'inactive' : 'active' }
        : owner
    ));
    if (toggleStatus) {
      toggleStatus(ownerId);
    }
  };

  const handleDeleteOwner = (ownerId) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      setOwners(owners.filter(owner => owner.id !== ownerId));
    }
  };

  const handleSaveOwner = (ownerData) => {
    if (selectedOwner) {
      setOwners(owners.map(o => o.id === selectedOwner.id ? { ...ownerData, id: selectedOwner.id, joinDate: selectedOwner.joinDate } : o));
      handleEdit && handleEdit(ownerData);
    } else {
      setOwners([...owners, { ...ownerData, id: Date.now(), status: 'active', joinDate: new Date().toISOString().split('T')[0] }]);
    }
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <button className="text-gray-600 mb-4 hover:text-gray-900 text-xl">&larr;</button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Management</h1>
        <p className="text-gray-600">Manage EV station owners and their profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Owners</span>
              <Users className="text-gray-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{owners.length}</div>
            <p className="text-sm text-gray-500 mt-1">All registered</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active</span>
              <UserCheck className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-600">{activeOwners}</div>
            <p className="text-sm text-gray-500 mt-1">Currently active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Inactive</span>
              <UserX className="text-red-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-red-600">{inactiveOwners}</div>
            <p className="text-sm text-gray-500 mt-1">Not active</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search and Add Button */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>
              <Button 
                onClick={() => { setSelectedOwner(null); setIsModalOpen(true); }} 
                icon={<Plus size={18} />}
              >
                Add Owner
              </Button>
            </div>
          </div>
          
          <Table
            columns={columns}
            data={filteredOwners}
            actions={(row) => (
              <div className="flex justify-end items-center space-x-3">
                <button
                  onClick={() => { setSelectedOwner(row); setIsModalOpen(true); }}
                  className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleToggleStatus(row.id)}
                  className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                    row.status === 'active' 
                      ? 'text-orange-600 hover:text-orange-800' 
                      : 'text-green-600 hover:text-green-800'
                  }`}
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {row.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteOwner(row.id)}
                  className="text-red-600 hover:text-red-800 p-1 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 text-center text-sm text-gray-500">
        EV Charging System v1.0
      </div>
      
      <OwnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        owner={selectedOwner}
        onSave={handleSaveOwner}
      />
    </div>
  );
};

export default OwnerManagement;