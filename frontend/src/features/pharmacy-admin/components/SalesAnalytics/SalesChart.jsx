import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr, timeRange) => {
  const date = new Date(dateStr);
  
  // For monthly data format
  if (dateStr.length === 7) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, month] = dateStr.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }
  
  if (timeRange === 'week') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const SalesChart = ({ data, timeRange, comparisonEnabled }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px]">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Trend</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => formatDate(value, timeRange)}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(value) => formatDate(value, timeRange)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name="Sales"
          />
          {comparisonEnabled && (
            <Line
              type="monotone"
              dataKey="previousSales"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Previous Period"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;