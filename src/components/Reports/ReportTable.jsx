import React from 'react';
import Table from '../common/Table';

const ReportTable = ({ reportType, data }) => {
  const columns = () => {
    switch (reportType) {
      case 'revenue':
        return [
          { header: 'Date', accessor: 'date' },
          { header: 'Station', accessor: 'station' },
          { header: 'Sessions', accessor: 'sessions' },
          { header: 'Energy (kWh)', accessor: 'energy' },
          {
            header: 'Revenue',
            accessor: 'revenue',
            render: (row) => <span className="font-semibold text-emerald-600">${row.revenue}</span>
          }
        ];
      case 'stations':
        return [
          { header: 'Station', accessor: 'station' },
          { header: 'Total Sessions', accessor: 'totalSessions' },
          { header: 'Avg Duration', accessor: 'avgDuration' },
          { header: 'Utilization', accessor: 'utilization' },
          {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                  row.status === 'Good'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                {row.status}
              </span>
            )
          }
        ];
      case 'users':
        return [
          { header: 'User', accessor: 'user' },
          { header: 'Total Sessions', accessor: 'totalSessions' },
          { header: 'Energy Used (kWh)', accessor: 'energyUsed' },
          { header: 'Total Spent', accessor: 'totalSpent' },
          { header: 'Last Activity', accessor: 'lastActivity' }
        ];
      case 'bookings':
        return [
          { header: 'Period', accessor: 'period' },
          { header: 'Total Bookings', accessor: 'totalBookings' },
          { header: 'Confirmed', accessor: 'confirmed' },
          { header: 'Canceled', accessor: 'canceled' },
          {
            header: 'Completion Rate',
            accessor: 'completionRate',
            render: (row) => (
              <span className="font-semibold text-slate-900">{row.completionRate}%</span>
            )
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur">
      <Table columns={columns()} data={data} borderless />
    </div>
  );
};

export default ReportTable;
