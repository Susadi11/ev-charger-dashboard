import React from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

const inputClasses =
  'w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/60';

const ReportFilters = ({ reportType, dateRange, onReportTypeChange, onDateRangeChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className={inputClasses}
          >
            <option value="revenue">Revenue Report</option>
            <option value="stations">Station Usage</option>
            <option value="users">User Activity</option>
            <option value="bookings">Booking Analytics</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-slate-500">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div className="flex items-end">
          <Button variant="secondary" icon={<Download size={18} />} className="w-full justify-center">
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
