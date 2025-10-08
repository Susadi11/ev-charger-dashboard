import React from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

const ReportFilters = ({ reportType, dateRange, onReportTypeChange, onDateRangeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => onReportTypeChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          <option value="revenue">Revenue Report</option>
          <option value="stations">Station Usage</option>
          <option value="users">User Activity</option>
          <option value="bookings">Booking Analytics</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>
      
      <div className="self-end">
        <Button variant="primary" icon={<Download size={18} />}>Export</Button>
      </div>
    </div>
  );
};

export default ReportFilters;