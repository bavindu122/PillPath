import React from 'react';

const LowStockAlerts = ({ alerts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div className="flex items-center">
              <div className="p-2 mr-3 bg-red-100 rounded-full">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{alert.itemName}</p>
                <p className="text-gray-500 text-sm">Only {alert.unitsLeft} units left</p>
              </div>
            </div>
            <button className="text-blue-600 hover:underline text-sm font-medium">Reorder</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlerts;