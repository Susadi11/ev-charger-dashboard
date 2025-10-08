import React, { useState } from 'react';
import { Search, Plus, Edit2, User, Trash2 } from 'lucide-react';
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
          <User className="mr-2 text-gray-500" size={18} />
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'NIC', accessor: 'nic' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Join Date', accessor: 'joinDate' }
  ];
  
  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Owner Management</h1>
        <p className="text-gray-600">Manage EV station owners and their profiles</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <Button onClick={() => { setSelectedOwner(null); setIsModalOpen(true); }} icon={<Plus size={20} />}>
              Add Owner
            </Button>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredOwners}
          actions={(row) => (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setSelectedOwner(row); setIsModalOpen(true); }}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleToggleStatus(row.id)}
                className={`p-1 ${
                  row.status === 'active' 
                    ? 'text-orange-600 hover:text-orange-800' 
                    : 'text-green-600 hover:text-green-800'
                }`}
                title={row.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                <span className="text-xs font-medium">
                  {row.status === 'active' ? 'Deactivate' : 'Activate'}
                </span>
              </button>
              <button
                onClick={() => handleDeleteOwner(row.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>
      
      <OwnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        owner={selectedOwner}
        onSave={(ownerData) => {
          if (selectedOwner) {
            setOwners(owners.map(o => o.id === selectedOwner.id ? { ...ownerData, id: selectedOwner.id } : o));
            handleEdit && handleEdit(ownerData);
          } else {
            setOwners([...owners, { ...ownerData, id: Date.now(), status: 'active', joinDate: new Date().toISOString().split('T')[0] }]);
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default OwnerManagement;