import React from 'react';
import { BarChart3, Users, MapPin, Calendar, TrendingUp, Activity } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Stations',
      value: '247',
      change: '+12%',
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Today\'s Sessions',
      value: '89',
      change: '+15%',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: '$12,450',
      change: '+23%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'session',
      message: 'New charging session started at Station #15',
      time: '2 minutes ago',
      icon: Activity
    },
    {
      id: 2,
      type: 'user',
      message: 'New user registered: john.doe@example.com',
      time: '15 minutes ago',
      icon: Users
    },
    {
      id: 3,
      type: 'station',
      message: 'Station #8 maintenance completed',
      time: '1 hour ago',
      icon: MapPin
    },
    {
      id: 4,
      type: 'session',
      message: 'Charging session completed at Station #22',
      time: '2 hours ago',
      icon: Activity
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your EV charging network.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gray-50`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Usage Analytics</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sessions</span>
                </div>
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add New Station</p>
                    <p className="text-sm text-gray-600">Register a new charging station</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600">View and edit user accounts</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Reports</p>
                    <p className="text-sm text-gray-600">Generate detailed analytics</p>
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
