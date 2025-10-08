import React from 'react';

const Table = ({ columns, data, actions, borderless = false, className = '' }) => {
  const hasData = data && data.length > 0;

  const containerClasses = borderless
    ? `overflow-x-auto ${className}`
    : `overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm ${className}`;

  return (
    <div className={containerClasses}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-gray-500"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!hasData ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-gray-900 align-middle"
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right text-sm">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
