import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import UserModal from './UserModal';

const defaultUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-01-10'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Operator',
    status: 'active',
    joinDate: '2024-02-15'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'User',
    status: 'inactive',
    joinDate: '2024-03-20'
  }
];

const UserManagement = ({ users: initialUsers, handleEdit, handleDelete }) => {
  const [users, setUsers] = useState(initialUsers || defaultUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(
    () => [
      {
        header: 'User',
        accessor: 'name',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <span className="text-sm font-medium">
                {row.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">{row.email}</p>
            </div>
          </div>
        )
      },
      {
        header: 'Role',
        accessor: 'role',
        render: (row) => {
          const roleStyles = {
            Admin: 'border-purple-200 bg-purple-50 text-purple-700',
            Operator: 'border-blue-200 bg-blue-50 text-blue-700',
            User: 'border-slate-200 bg-slate-50 text-slate-700'
          };
          return (
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                roleStyles[row.role] || roleStyles.User
              }`}
            >
              {row.role}
            </span>
          );
        }
      },
      {
        header: 'Status',
        accessor: 'status',
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
              row.status === 'active'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {row.status}
          </span>
        )
      },
      {
        header: 'Join Date',
        accessor: 'joinDate',
        render: (row) => <span className="text-sm text-slate-600">{row.joinDate}</span>
      }
    ],
    []
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;
  const adminUsers = users.filter((u) => u.role === 'Admin').length;

  const statCards = useMemo(
    () => [
      {
        label: 'Total Users',
        value: users.length,
        hint: 'All registered',
        icon: Users,
        iconBg: 'from-blue-500/10 to-indigo-500/10 border-blue-200/40',
        iconColor: 'text-blue-600',
        accent: 'from-slate-50 to-slate-100/40 border-slate-200/70'
      },
      {
        label: 'Active',
        value: activeUsers,
        hint: 'Currently active',
        icon: UserCheck,
        iconBg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/40',
        iconColor: 'text-emerald-600',
        accent: 'from-emerald-50 to-teal-100/40 border-emerald-200/60'
      },
      {
        label: 'Inactive',
        value: inactiveUsers,
        hint: 'Access suspended',
        icon: UserX,
        iconBg: 'from-rose-500/10 to-red-500/10 border-rose-200/40',
        iconColor: 'text-rose-500',
        accent: 'from-rose-50 to-red-100/40 border-rose-200/60'
      },
      {
        label: 'Admins',
        value: adminUsers,
        hint: 'Privileged users',
        icon: Shield,
        iconBg: 'from-purple-500/10 to-indigo-500/10 border-purple-200/40',
        iconColor: 'text-purple-600',
        accent: 'from-purple-50 to-indigo-100/40 border-purple-200/60'
      }
    ],
    [users.length, activeUsers, inactiveUsers, adminUsers]
  );

  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      handleDelete && handleDelete(userId);
    }
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...userData,
                id: selectedUser.id,
                joinDate: selectedUser.joinDate
              }
            : user
        )
      );
      handleEdit && handleEdit(userData);
    } else {
      setUsers((prev) => [
        ...prev,
        {
          ...userData,
          id: Date.now(),
          status: userData.status || 'active',
          joinDate: new Date().toISOString().split('T')[0]
        }
      ]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const iconButtonClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-gray-100';
  const statusButtonClass = (isActive) =>
    `inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
      isActive
        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
    }`;

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                User Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage permissions and keep your operator experience seamless.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedUser(null);
                setIsModalOpen(true);
              }}
              icon={<Plus size={18} />}
              className="self-start md:self-auto"
            >
              Add User
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${card.accent}`}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-white/10 to-white/30" />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`rounded-2xl border px-3 py-2 backdrop-blur ${card.iconBg}`}
                      >
                        <Icon className={`h-5 w-5 ${card.iconColor}`} />
                      </div>
                      <span className="text-3xl font-semibold tracking-tight text-slate-900">
                        {card.value}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700">
                        {card.label}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {card.hint}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="mb-6 bg-gray-50/70 rounded-2xl p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredUsers}
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(row);
                    setIsModalOpen(true);
                  }}
                  className={`${iconButtonClass} hover:text-blue-600`}
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(row.id)}
                  className={statusButtonClass(row.status === 'active')}
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {row.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteUser(row.id)}
                  className={`${iconButtonClass} hover:bg-rose-50 hover:text-rose-600`}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          />
        </section>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
