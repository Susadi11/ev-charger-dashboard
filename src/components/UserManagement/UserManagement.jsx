import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import UserModal from './UserModal';

const UserManagement = ({ users: initialUsers, handleEdit, handleDelete }) => {
  const [users, setUsers] = useState(initialUsers || [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Operator', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'inactive' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      accessor: 'role',
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.role}
        </span>
      )
    },
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
    }
  ];
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      handleDelete && handleDelete(userId);
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage system users and their permissions</p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <Button 
              onClick={() => { 
                setSelectedUser(null); 
                setIsModalOpen(true); 
              }} 
              icon={<Plus size={20} />}
            >
              Add User
            </Button>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredUsers}
          actions={(row) => (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleToggleStatus(row.id)}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  row.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {row.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => { 
                  setSelectedUser(row); 
                  setIsModalOpen(true); 
                }}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDeleteUser(row.id)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>
      
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={(userData) => {
          if (selectedUser) {
            setUsers(users.map(u => 
              u.id === selectedUser.id 
                ? { ...userData, id: selectedUser.id } 
                : u
            ));
            handleEdit && handleEdit(userData);
          } else {
            setUsers([...users, { 
              ...userData, 
              id: Date.now(), 
              status: userData.status || 'active' 
            }]);
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default UserManagement;