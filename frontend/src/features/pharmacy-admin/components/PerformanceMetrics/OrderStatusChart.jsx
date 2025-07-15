import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


const OrderStatusChart = ({ data }) => {
  // Guard: show message if data is missing or empty
  if (!data || !Array.isArray(data.labels) || !Array.isArray(data.values) || !Array.isArray(data.colors) || data.labels.length === 0 || data.values.length === 0 || data.colors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="flex justify-center items-center h-full text-gray-500">No order status data available.</div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors,
        borderColor: data.colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
      
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Order Status</h2>
      <div className="flex justify-center items-center h-70">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default OrderStatusChart;