import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Activity,
  Zap,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getAllStations } from '../api/stationsApi.js';
import { getAllEVOwners } from '../api/evOwnerApi.js';
import { getAllReservations } from '../api/reservationApi.js';
import { getAllUsers } from '../api/authApi.js';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStations: 0,
    activeStations: 0,
    totalOwners: 0,
    activeOwners: 0,
    totalReservations: 0,
    todayReservations: 0,
    pendingReservations: 0,
    completedReservations: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [stationsRes, ownersData, reservationsData, usersData] = await Promise.all([
        getAllStations().catch(() => ({ success: true, data: [] })),
        getAllEVOwners().catch(() => []),
        getAllReservations().catch(() => []),
        getAllUsers().catch(() => []),
      ]);

      // Process stations data
      const stations = stationsRes.success ? stationsRes.data : [];
      const activeStations = stations.filter(s => s.isActive).length;

      // Process owners data
      const activeOwners = ownersData.filter(o => o.isActive).length;

      // Process reservations data
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayReservations = reservationsData.filter(r => {
        const resDate = new Date(r.startTime);
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === today.getTime();
      }).length;

      const pendingReservations = reservationsData.filter(
        r => r.status === 'Pending' || r.status === 'Active'
      ).length;

      const completedReservations = reservationsData.filter(
        r => r.status === 'Completed'
      ).length;

      // Build recent activities
      const activities = [];
      
      // Add recent reservations
      reservationsData.slice(0, 2).forEach(res => {
        const timeAgo = getTimeAgo(new Date(res.createdAt));
        activities.push({
          id: `res-${res.id}`,
          type: 'reservation',
          message: `New reservation created for Station`,
          time: timeAgo,
          icon: Calendar
        });
      });

      // Add recent owners
      if (ownersData.length > 0) {
        const recentOwner = ownersData[0];
        activities.push({
          id: `owner-${recentOwner.id}`,
          type: 'user',
          message: `New EV owner registered: ${recentOwner.email}`,
          time: getTimeAgo(new Date(recentOwner.createdAt)),
          icon: Users
        });
      }

      // Add station updates
      if (stations.length > 0) {
        const recentStation = stations[0];
        activities.push({
          id: `station-${recentStation.id}`,
          type: 'station',
          message: `Station "${recentStation.name}" is ${recentStation.isActive ? 'operational' : 'offline'}`,
          time: getTimeAgo(new Date(recentStation.createdAt)),
          icon: MapPin
        });
      }

      setStats({
        totalStations: stations.length,
        activeStations,
        totalOwners: ownersData.length,
        activeOwners,
        totalReservations: reservationsData.length,
        todayReservations,
        pendingReservations,
        completedReservations,
        totalUsers: usersData.length,
      });

      setRecentActivities(activities.slice(0, 4));
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const statCards = [
    {
      title: 'Total Stations',
      value: stats.totalStations,
      subtitle: `${stats.activeStations} active`,
      icon: MapPin,
      iconBg: 'from-blue-500/10 to-indigo-500/10 border-blue-200/40',
      iconColor: 'text-blue-600',
      accent: 'from-slate-50 to-slate-100/40 border-slate-200/70'
    },
    {
      title: 'EV Owners',
      value: stats.totalOwners,
      subtitle: `${stats.activeOwners} active`,
      icon: Users,
      iconBg: 'from-green-500/10 to-emerald-500/10 border-green-200/40',
      iconColor: 'text-green-600',
      accent: 'from-emerald-50 to-teal-100/40 border-emerald-200/60'
    },
    {
      title: 'Today\'s Bookings',
      value: stats.todayReservations,
      subtitle: `${stats.pendingReservations} pending`,
      icon: Calendar,
      iconBg: 'from-purple-500/10 to-violet-500/10 border-purple-200/40',
      iconColor: 'text-purple-600',
      accent: 'from-purple-50 to-violet-100/40 border-purple-200/60'
    },
    {
      title: 'Total Bookings',
      value: stats.totalReservations,
      subtitle: `${stats.completedReservations} completed`,
      icon: Zap,
      iconBg: 'from-orange-500/10 to-amber-500/10 border-orange-200/40',
      iconColor: 'text-orange-600',
      accent: 'from-orange-50 to-amber-100/40 border-orange-200/60'
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here's what's happening with your EV charging network.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
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
                      {card.title}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Station Status */}
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Charging Stations
                        </p>
                        <p className="text-xs text-slate-500">
                          {stats.activeStations} of {stats.totalStations} operational
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {stats.totalStations > 0 
                          ? Math.round((stats.activeStations / stats.totalStations) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-slate-500">Uptime</p>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="p-4 bg-green-50 rounded-2xl border border-green-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Registered Users
                        </p>
                        <p className="text-xs text-slate-500">
                          {stats.activeOwners} active EV owners
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {stats.totalOwners + stats.totalUsers}
                      </p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                  </div>
                </div>

                {/* Reservations Stats */}
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Reservations
                        </p>
                        <p className="text-xs text-slate-500">
                          {stats.pendingReservations} pending, {stats.completedReservations} completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {stats.totalReservations}
                      </p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => window.location.href = '/stations'}
                className="p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Stations</p>
                    <p className="text-sm text-gray-600">View all charging stations</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/owners'}
                className="p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Owners</p>
                    <p className="text-sm text-gray-600">View EV owner accounts</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => window.location.href = '/reservations'}
                className="p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Bookings</p>
                    <p className="text-sm text-gray-600">Manage reservations</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;