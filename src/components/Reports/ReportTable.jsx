import React from 'react';
import Table from '../common/Table';

const ReportTable = ({ reportType, data }) => {
  const getColumns = () => {
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
            render: (row) => <span className="font-semibold text-green-600">${row.revenue}</span>
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
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                row.status === 'Good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
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
            render: (row) => <span className="font-semibold">{row.completionRate}%</span>
          }
        ];
      default:
        return [];
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table columns={getColumns()} data={data} />
    </div>
  );
};

export default ReportTable;