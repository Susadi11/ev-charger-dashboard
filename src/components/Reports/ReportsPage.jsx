import React, { useMemo, useState } from 'react';
import ReportFilters from './ReportFilters';
import ReportTable from './ReportTable';

const ReportsPage = ({ reportData: initialReportData, reportType: initialReportType, dateRange: initialDateRange }) => {
  const [reportType, setReportType] = useState(initialReportType || 'revenue');
  const [dateRange, setDateRange] = useState(
    initialDateRange || {
      startDate: '2025-10-01',
      endDate: '2025-10-08'
    }
  );

  const reportDataSets = useMemo(
    () => ({
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
    }),
    []
  );

  const [reportData, setReportData] = useState(initialReportData || reportDataSets[reportType]);

  const handleReportTypeChange = (newType) => {
    setReportType(newType);
    setReportData(reportDataSets[newType]);
  };

  return (
    <div className="p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Reports &amp; Analytics</h1>
              <p className="mt-2 text-sm text-slate-500">
                High-fidelity insights to keep your charging experience in perfect shape.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <ReportFilters
              reportType={reportType}
              dateRange={dateRange}
              onReportTypeChange={handleReportTypeChange}
              onDateRangeChange={setDateRange}
            />
          </div>

          <div>
            <ReportTable reportType={reportType} data={reportData} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;
