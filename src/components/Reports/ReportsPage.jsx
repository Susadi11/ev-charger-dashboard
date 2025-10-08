import React, { useState } from 'react';
import ReportFilters from './ReportFilters';
import ReportTable from './ReportTable';

const ReportsPage = ({ reportData: initialReportData, reportType: initialReportType, dateRange: initialDateRange }) => {
  const [reportType, setReportType] = useState(initialReportType || 'revenue');
  const [dateRange, setDateRange] = useState(initialDateRange || {
    startDate: '2025-10-01',
    endDate: '2025-10-08'
  });
  
  // Mock data for different report types
  const reportDataSets = {
    revenue: [
      { date: '2025-10-08', station: 'Downtown Charging Hub', sessions: 15, energy: 450, revenue: '11,250' },
      { date: '2025-10-07', station: 'Airport Station', sessions: 12, energy: 360, revenue: '9,000' },
      { date: '2025-10-06', station: 'Mall Parking', sessions: 18, energy: 540, revenue: '13,500' }
    ],
    stations: [
      { station: 'Downtown Charging Hub', totalSessions: 156, avgDuration: '2.5h', utilization: '78%', status: 'Good' },
      { station: 'Airport Station', totalSessions: 142, avgDuration: '1.8h', utilization: '65%', status: 'Good' },
      { station: 'Mall Parking', totalSessions: 98, avgDuration: '2.2h', utilization: '52%', status: 'Fair' }
    ],
    users: [
      { user: 'Rajesh Kumar', totalSessions: 24, energyUsed: 720, totalSpent: '$18,000', lastActivity: '2025-10-08' },
      { user: 'Nimal Silva', totalSessions: 18, energyUsed: 540, totalSpent: '$13,500', lastActivity: '2025-10-07' },
      { user: 'Priya Fernando', totalSessions: 15, energyUsed: 450, totalSpent: '$11,250', lastActivity: '2025-10-06' }
    ],
    bookings: [
      { period: 'Week 1', totalBookings: 145, confirmed: 132, canceled: 13, completionRate: '91' },
      { period: 'Week 2', totalBookings: 158, confirmed: 145, canceled: 13, completionRate: '92' },
      { period: 'Week 3', totalBookings: 162, confirmed: 148, canceled: 14, completionRate: '91' }
    ]
  };
  
  const [reportData, setReportData] = useState(initialReportData || reportDataSets[reportType]);
  
  const handleReportTypeChange = (newType) => {
    setReportType(newType);
    setReportData(reportDataSets[newType]);
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">View detailed reports and insights</p>
      </div>
      
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <ReportFilters
          reportType={reportType}
          dateRange={dateRange}
          onReportTypeChange={handleReportTypeChange}
          onDateRangeChange={setDateRange}
        />
      </div>
      
      <ReportTable reportType={reportType} data={reportData} />
    </div>
  );
};

export default ReportsPage;