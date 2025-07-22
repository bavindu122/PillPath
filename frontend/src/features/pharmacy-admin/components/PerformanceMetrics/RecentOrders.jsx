import React from 'react';

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div className="flex items-center">
              {order.status === 'Completed' && (
                <div className="p-2 mr-3 bg-green-100 rounded-full">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
              {order.status === 'Pending' && (
                <div className="p-2 mr-3 bg-yellow-100 rounded-full">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              )}
              <div>
                <p className="text-gray-900 font-medium">{order.id}</p>
                <p className="text-gray-500 text-sm">{order.customerName} - {order.amount}</p>
              </div>
            </div>
            <span className={`text-sm font-medium ${order.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentOrders;