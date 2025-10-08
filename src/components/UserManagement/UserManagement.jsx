import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Users, UserCheck, UserX, Shield } from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import UserModal from './UserModal';

const UserManagement = ({ users: initialUsers, handleEdit, handleDelete }) => {
  const [users, setUsers] = useState(initialUsers || [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Operator', status: 'active', joinDate: '2024-02-15' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'inactive', joinDate: '2024-03-20' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-gray-600">
              {row.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
          </div>
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
      header: 'Role', 
      accessor: 'role',
      render: (row) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          row.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
          row.role === 'Operator' ? 'bg-blue-100 text-blue-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {row.role}
        </span>
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
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const adminUsers = users.filter(u => u.role === 'Admin').length;

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

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...userData, id: selectedUser.id, joinDate: selectedUser.joinDate } 
          : u
      ));
      handleEdit && handleEdit(userData);
    } else {
      setUsers([...users, { 
        ...userData, 
        id: Date.now(), 
        status: userData.status || 'active',
        joinDate: new Date().toISOString().split('T')[0]
      }]);
    }
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <button className="text-gray-600 mb-4 hover:text-gray-900 text-xl">&larr;</button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage system users and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Users</span>
              <Users className="text-gray-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
            <p className="text-sm text-gray-500 mt-1">All registered</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active</span>
              <UserCheck className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-sm text-gray-500 mt-1">Currently active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Inactive</span>
              <UserX className="text-red-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-red-600">{inactiveUsers}</div>
            <p className="text-sm text-gray-500 mt-1">Not active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Admins</span>
              <Shield className="text-purple-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-purple-600">{adminUsers}</div>
            <p className="text-sm text-gray-500 mt-1">Admin users</p>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>
              <Button 
                onClick={() => { 
                  setSelectedUser(null); 
                  setIsModalOpen(true); 
                }} 
                icon={<Plus size={18} />}
              >
                Add User
              </Button>
            </div>
          </div>
          
          <Table
            columns={columns}
            data={filteredUsers}
            actions={(row) => (
              <div className="flex justify-end items-center space-x-3">
                <button
                  onClick={() => { 
                    setSelectedUser(row); 
                    setIsModalOpen(true); 
                  }}
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
                  onClick={() => handleDeleteUser(row.id)}
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
      
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;