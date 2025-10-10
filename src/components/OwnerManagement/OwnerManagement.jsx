import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  User,
  Trash2,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import Table from '../common/Table';
import Button from '../common/Button';
import OwnerModal from './OwnerModal';
import {
  getAllEVOwners,
  deleteEVOwner,
  activateEVOwner,
  deactivateEVOwner
} from '../../api/evOwnerApi.js';

const OwnerManagement = () => {
  const [owners, setOwners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all EV owners on component mount
  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEVOwners();
      // Transform backend data to match frontend structure
      const transformedOwners = data.map((owner) => ({
        id: owner.id,
        name: owner.name,
        email: owner.email,
        nic: owner.nic,
        phone: owner.phone,
        vehicleType: owner.vehicleType,
        status: owner.isActive ? 'active' : 'inactive',
        joinDate: new Date(owner.createdAt).toISOString().split('T')[0]
      }));
      setOwners(transformedOwners);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch owners:', err);
    } finally {
      setLoading(false);
    }
  };

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
        header: 'Vehicle Type',
        accessor: 'vehicleType',
        render: (row) => (
          <span className="text-sm text-slate-600">{row.vehicleType || 'N/A'}</span>
        )
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
          owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          owner.nic.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleToggleStatus = async (owner) => {
    try {
      if (owner.status === 'active') {
        await deactivateEVOwner(owner.nic);
      } else {
        await activateEVOwner(owner.nic);
      }
      // Refresh the list after status change
      await fetchOwners();
    } catch (err) {
      alert(`Failed to ${owner.status === 'active' ? 'deactivate' : 'activate'} owner: ${err.message}`);
      console.error('Toggle status error:', err);
    }
  };

  const handleDeleteOwner = async (owner) => {
    if (window.confirm(`Are you sure you want to permanently delete ${owner.name}? This action cannot be undone.`)) {
      try {
        await deleteEVOwner(owner.nic);
        // Refresh the list after deletion
        await fetchOwners();
      } catch (err) {
        alert(`Failed to delete owner: ${err.message}`);
        console.error('Delete error:', err);
      }
    }
  };

  const handleSaveOwner = async (ownerData) => {
    // Refresh the owner list after save
    await fetchOwners();
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  const iconButtonClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-gray-100';
  const statusButtonClass = (isActive) =>
    `inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-xs font-semibold transition-all ${
      isActive
        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
    }`;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading owners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={fetchOwners} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                placeholder="Search owners by name, email, or NIC..."
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
                  onClick={() => handleToggleStatus(row)}
                  className={statusButtonClass(row.status === 'active')}
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {row.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteOwner(row)}
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