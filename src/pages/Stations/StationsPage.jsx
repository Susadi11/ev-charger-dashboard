import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Zap,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import StationModal from '../../components/StationManagement/StationModal';
import StationDetailsView from '../../components/StationManagement/StationDetailsView';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import stationsApi, { transformFormDataToApi } from '../../api/stationsApi';

const statusStyles = {
  operational: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  maintenance: 'border-amber-200 bg-amber-50 text-amber-700',
  offline: 'border-rose-200 bg-rose-50 text-rose-700'
};

const typeStyles = {
  AC: 'border-blue-200 bg-blue-50 text-blue-700',
  DC: 'border-purple-200 bg-purple-50 text-purple-700',
  Both: 'border-indigo-200 bg-indigo-50 text-indigo-700'
};

const StationsPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Load stations from API on component mount
  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await stationsApi.getAllStations();
      
      if (response.success && response.data) {
        // Transform backend station data to frontend format
        const transformedStations = response.data.map((backendStation) => ({
          id: backendStation.id,
          name: backendStation.name,
          location: backendStation.address.split(',')[0] || 'Unknown Location',
          address: backendStation.address,
          type: backendStation.type,
          slots: backendStation.totalSlots,
          available: backendStation.availableSlots,
          status: backendStation.isActive ? 'operational' : 'offline',
          latitude: backendStation.latitude?.toString(),
          longitude: backendStation.longitude?.toString(),
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
        }));
        
        setStations(transformedStations);
      } else {
        throw new Error('Failed to load stations');
      }
    } catch (error) {
      console.error('Error loading stations:', error);
      setError('Failed to load stations. Please try again.');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => ({
      total: stations.length,
      operational: stations.filter((s) => s.status === 'operational').length,
      maintenance: stations.filter((s) => s.status === 'maintenance').length,
      offline: stations.filter((s) => s.status === 'offline').length
    }),
    [stations]
  );

  const filteredStations = useMemo(
    () =>
      stations.filter((station) => {
        const matchesSearch =
          station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          station.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || station.status === filterStatus;
        const matchesType = filterType === 'all' || station.type === filterType;

        return matchesSearch && matchesStatus && matchesType;
      }),
    [stations, searchTerm, filterStatus, filterType]
  );

  const columns = useMemo(
    () => [
      {
        header: 'Station',
        accessor: 'name',
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-yellow-200/60 bg-yellow-50 p-2 text-yellow-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{row.name}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3 w-3" />
                {row.location}
              </p>
            </div>
          </div>
        )
      },
      {
        header: 'Type',
        accessor: 'type',
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
              typeStyles[row.type] || typeStyles.AC
            }`}
          >
            {row.type}
          </span>
        )
      },
      {
        header: 'Availability',
        accessor: 'slots',
        render: (row) => (
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-900">
              {row.available}/{row.slots}
            </span>
            <span className="block text-xs text-slate-500">Slots available</span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  row.available === 0 ? 'bg-rose-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min((row.available / row.slots) * 100, 100)}%` }}
              />
            </div>
          </div>
        )
      },
      {
        header: 'Status',
        accessor: 'status',
        render: (row) => (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              statusStyles[row.status] || statusStyles.operational
            }`}
          >
            {row.status}
          </span>
        )
      }
    ],
    []
  );

  /**
   * Save station - CREATE or UPDATE
   * Makes API call first, then updates local state
   */
  const handleSaveStation = async (stationData) => {
    try {
      setActionLoading(true);
      setActionError(null);

      if (selectedStation) {
        // UPDATE existing station
        const updatePayload = transformFormDataToApi(stationData);
        const response = await stationsApi.updateStation(selectedStation.id, updatePayload);

        if (response.success) {
          // Update local state with new data
          setStations((prev) =>
            prev.map((station) =>
              station.id === selectedStation.id
                ? {
                    ...station,
                    name: stationData.name,
                    location: stationData.location,
                    address: stationData.address,
                    type: stationData.type,
                    slots: stationData.slots,
                    status: stationData.status,
                    latitude: stationData.latitude,
                    longitude: stationData.longitude,
                    operatingHours: stationData.operatingHours,
                    schedule: stationData.schedule
                  }
                : station
            )
          );

          console.log('Station updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update station');
        }
      } else {
        // CREATE new station
        const createPayload = transformFormDataToApi(stationData);
        const response = await stationsApi.createStation(createPayload);

        if (response.success && response.data) {
          // Transform and add new station to state
          const newBackendStation = response.data;
          const newStation = {
            id: newBackendStation.id,
            name: newBackendStation.name,
            location: newBackendStation.address.split(',')[0] || 'Unknown Location',
            address: newBackendStation.address,
            type: newBackendStation.type,
            slots: newBackendStation.totalSlots,
            available: newBackendStation.availableSlots,
            status: newBackendStation.isActive ? 'operational' : 'offline',
            latitude: newBackendStation.latitude?.toString(),
            longitude: newBackendStation.longitude?.toString(),
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
          };

          setStations((prev) => [...prev, newStation]);
          console.log('Station created successfully');
        } else {
          throw new Error(response.message || 'Failed to create station');
        }
      }

      setIsModalOpen(false);
      setSelectedStation(null);
    } catch (err) {
      console.error('Error saving station:', err);
      setActionError(err.message || 'Failed to save station. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Delete station
   * Makes API call first, then updates local state
   */
  const handleDeleteStation = async (stationId) => {
    const station = stations.find((s) => s.id === stationId);

    if (!station) return;

    if (!window.confirm(`Are you sure you want to delete "${station.name}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);

      const response = await stationsApi.deleteStation(stationId);

      if (response.success) {
        // Remove from local state
        setStations((prev) => prev.filter((s) => s.id !== stationId));
        console.log('Station deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete station');
      }
    } catch (err) {
      console.error('Error deleting station:', err);
      setActionError(err.message || 'Failed to delete station. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
  };

  const handleViewClick = (station) => {
    setSelectedStation(station);
    setIsDetailsOpen(true);
  };

  const handleAddClick = () => {
    setSelectedStation(null);
    setIsModalOpen(true);
  };

  const iconButtonClass =
    'inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed';

  if (loading) {
    return (
      <div className="p-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <section className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Station Management
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Monitor availability, status changes, and keep your network refined.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <section className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Station Management
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Monitor availability, status changes, and keep your network refined.
                </p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadStations}
                className="bg-red-100 text-red-800 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </section>
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
                Station Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Monitor availability, status changes, and keep your network refined.
              </p>
            </div>
            <Button
              onClick={handleAddClick}
              icon={<Plus size={18} />}
              className="self-start md:self-auto"
              disabled={actionLoading}
            >
              Add Station
            </Button>
          </div>

          {/* Action error message */}
          {actionError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 text-sm">{actionError}</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Total Stations',
                value: stats.total,
                hint: 'All locations',
                accent: 'from-slate-50 to-slate-100/40 border-slate-200/70',
                iconBg: 'from-slate-500/10 to-slate-700/10 border-slate-200/40',
                iconColor: 'text-slate-700'
              },
              {
                label: 'Operational',
                value: stats.operational,
                hint: 'Serving drivers',
                accent: 'from-emerald-50 to-teal-100/40 border-emerald-200/60',
                iconBg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/40',
                iconColor: 'text-emerald-600'
              },
              {
                label: 'Maintenance',
                value: stats.maintenance,
                hint: 'Under review',
                accent: 'from-amber-50 to-yellow-100/40 border-amber-200/60',
                iconBg: 'from-amber-500/10 to-orange-500/10 border-amber-200/40',
                iconColor: 'text-amber-600'
              },
              {
                label: 'Offline',
                value: stats.offline,
                hint: 'Needs attention',
                accent: 'from-rose-50 to-red-100/40 border-rose-200/60',
                iconBg: 'from-rose-500/10 to-red-500/10 border-rose-200/40',
                iconColor: 'text-rose-600'
              }
            ].map((card) => (
              <div
                key={card.label}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${card.accent}`}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-white/10 to-white/30" />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-2xl border px-3 py-2 backdrop-blur ${card.iconBg}`}>
                      <Zap className={`h-5 w-5 ${card.iconColor}`} />
                    </div>
                    <span className="text-3xl font-semibold tracking-tight text-slate-900">
                      {card.value}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">{card.label}</p>
                    <p className="text-xs font-medium text-slate-500">{card.hint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr,auto] lg:items-center">
              <div className="bg-gray-50/70 rounded-2xl p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                >
                  <option value="all">All Status</option>
                  <option value="operational">Operational</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                >
                  <option value="all">All Types</option>
                  <option value="AC">AC</option>
                  <option value="DC">DC</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
          </div>

          <Table
            columns={columns}
            data={filteredStations}
            actions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleViewClick(row)}
                  className={`${iconButtonClass}`}
                  title="View details"
                  disabled={actionLoading}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditClick(row)}
                  className={`${iconButtonClass}`}
                  title="Edit station"
                  disabled={actionLoading}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteStation(row.id)}
                  className={`${iconButtonClass} hover:bg-rose-50 hover:text-rose-600`}
                  title="Delete station"
                  disabled={actionLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          />
        </section>
      </div>

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