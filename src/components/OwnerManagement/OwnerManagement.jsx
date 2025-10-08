import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  User,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Power
} from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import OwnerModal from './OwnerModal';

const defaultOwners = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    nic: '912345678V',
    phone: '+94771234567',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Nimal Silva',
    email: 'nimal@example.com',
    nic: '901234567V',
    phone: '+94772345678',
    status: 'active',
    joinDate: '2024-02-20'
  },
  {
    id: 3,
    name: 'Priya Fernando',
    email: 'priya@example.com',
    nic: '895678901V',
    phone: '+94773456789',
    status: 'inactive',
    joinDate: '2024-03-10'
  }
];

const OwnerManagement = ({ owners: initialOwners, handleEdit, toggleStatus }) => {
  const [owners, setOwners] = useState(initialOwners || defaultOwners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.name}</p>
              <p className="text-xs text-slate-500">{row.email}</p>
            </div>
          </div>
        )
      },
      {
        header: 'NIC',
        accessor: 'nic',
        render: (row) => <span className="text-sm text-slate-600">{row.nic}</span>
      },
      {
        header: 'Phone',
        accessor: 'phone',
        render: (row) => <span className="text-sm text-slate-600">{row.phone}</span>
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

  const filteredOwners = useMemo(
    () =>
      owners.filter(
        (owner) =>
          owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [owners, searchTerm]
  );

  const activeOwners = owners.filter((o) => o.status === 'active').length;
  const inactiveOwners = owners.filter((o) => o.status === 'inactive').length;

  const statCards = useMemo(
    () => [
      {
        label: 'Total Owners',
        value: owners.length,
        hint: 'All registered',
        icon: Users,
        iconBg: 'from-blue-500/10 to-indigo-500/10 border-blue-200/40',
        iconColor: 'text-blue-600',
        accent: 'from-slate-50 to-slate-100/40 border-slate-200/70'
      },
      {
        label: 'Active',
        value: activeOwners,
        hint: 'Currently active',
        icon: UserCheck,
        iconBg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/40',
        iconColor: 'text-emerald-600',
        accent: 'from-emerald-50 to-teal-100/40 border-emerald-200/60'
      },
      {
        label: 'Inactive',
        value: inactiveOwners,
        hint: 'Access suspended',
        icon: UserX,
        iconBg: 'from-rose-500/10 to-red-500/10 border-rose-200/40',
        iconColor: 'text-rose-500',
        accent: 'from-rose-50 to-red-100/40 border-rose-200/60'
      }
    ],
    [owners.length, activeOwners, inactiveOwners]
  );

  const handleToggleStatus = (ownerId) => {
    setOwners((prev) =>
      prev.map((owner) =>
        owner.id === ownerId
          ? { ...owner, status: owner.status === 'active' ? 'inactive' : 'active' }
          : owner
      )
    );
    toggleStatus && toggleStatus(ownerId);
  };

  const handleDeleteOwner = (ownerId) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      setOwners((prev) => prev.filter((owner) => owner.id !== ownerId));
    }
  };

  const handleSaveOwner = (ownerData) => {
    if (selectedOwner) {
      setOwners((prev) =>
        prev.map((owner) =>
          owner.id === selectedOwner.id
            ? {
                ...ownerData,
                id: selectedOwner.id,
                joinDate: selectedOwner.joinDate
              }
            : owner
        )
      );
      handleEdit && handleEdit(ownerData);
    } else {
      setOwners((prev) => [
        ...prev,
        {
          ...ownerData,
          id: Date.now(),
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0]
        }
      ]);
    }
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  const iconButtonClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-gray-100';

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Owner Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Curate a polished experience for every charging station owner.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedOwner(null);
                setIsModalOpen(true);
              }}
              icon={<Plus size={18} />}
              className="self-start md:self-auto"
            >
              Add Owner
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
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
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredOwners}
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedOwner(row);
                    setIsModalOpen(true);
                  }}
                  className={`${iconButtonClass} hover:text-blue-600`}
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(row.id)}
                  className={`${iconButtonClass} ${
                    row.status === 'active'
                      ? 'hover:bg-amber-50 hover:text-amber-600'
                      : 'hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteOwner(row.id)}
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

      <OwnerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOwner(null);
        }}
        owner={selectedOwner}
        onSave={handleSaveOwner}
      />
    </div>
  );
};

export default OwnerManagement;
