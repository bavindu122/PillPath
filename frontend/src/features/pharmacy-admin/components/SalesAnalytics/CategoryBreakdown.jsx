import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

// Define custom colors for Cash and Card
const COLORS = ['#10b981', '#3b82f6']; // Green for Cash, Blue for Card

// This function is no longer needed as the user requested to remove the labels on the pie slices.
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//       fontSize={12}
//       fontWeight={600}
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// Renamed prop from salesByCategory to paymentDistribution for clarity
const CategoryBreakdown = ({ salesByCategory: paymentDistribution }) => { // Alias salesByCategory to paymentDistribution
  const chartData = paymentDistribution.map(item => ({
    name: item.category,
    value: item.percentage
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Distribution</h3>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // Removed the label prop to only show labels in the legend
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']}
            />
            <Legend
              layout="horizontal" // Changed to horizontal layout
              verticalAlign="bottom" // Aligned to bottom
              align="center" // Centered the legend
              formatter={(value, entry) => {
                const { category, sales } = paymentDistribution.find(item => item.category === value);
                return <span className="text-sm text-gray-700">{category} (Rs.{sales.toLocaleString()})</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {paymentDistribution.map(paymentType => (
          <div key={paymentType.category} className="flex items-center">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full" style={{
                  backgroundColor: COLORS[paymentDistribution.indexOf(paymentType) % COLORS.length]
                }} />
                <p className="text-sm font-medium">{paymentType.category}</p>
              </div>
              {/* For payment distribution, 'orders' might not be directly relevant, but keeping the structure */}
              <p className="text-xs text-gray-500 mt-1">Rs.{paymentType.sales.toLocaleString()} sales</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              paymentType.growth >= 0 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
            }`}>
              {paymentType.growth >= 0 ? '+' : ''}{paymentType.growth}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;



















// import React from 'react';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip
// } from 'recharts';

// // Define custom colors for Cash and Card
// const COLORS = ['#10b981', '#3b82f6']; // Green for Cash, Blue for Card

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//       fontSize={12}
//       fontWeight={600}
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// // Renamed prop from salesByCategory to paymentDistribution for clarity
// const CategoryBreakdown = ({ salesByCategory: paymentDistribution }) => { // Alias salesByCategory to paymentDistribution
//   const chartData = paymentDistribution.map(item => ({
//     name: item.category,
//     value: item.percentage
//   }));

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Distribution</h3> {/* Changed title */}

//       <div className="h-[300px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {chartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip
//               formatter={(value) => [`${value.toFixed(1)}%`, 'Percentage']}
//             />
//             <Legend
//               layout="vertical"
//               verticalAlign="middle"
//               align="right"
//               formatter={(value, entry) => {
//                 const { category, sales } = paymentDistribution.find(item => item.category === value);
//                 return <span className="text-sm text-gray-700">{category} (${sales.toLocaleString()})</span>;
//               }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mt-4">
//         {paymentDistribution.map(paymentType => (
//           <div key={paymentType.category} className="flex items-center">
//             <div className="flex-1">
//               <div className="flex items-center">
//                 <div className="mr-2 h-3 w-3 rounded-full" style={{
//                   backgroundColor: COLORS[paymentDistribution.indexOf(paymentType) % COLORS.length]
//                 }} />
//                 <p className="text-sm font-medium">{paymentType.category}</p>
//               </div>
//               {/* For payment distribution, 'orders' might not be directly relevant, but keeping the structure */}
//               <p className="text-xs text-gray-500 mt-1">${paymentType.sales.toLocaleString()} sales</p>
//             </div>
//             <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//               paymentType.growth >= 0 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
//             }`}>
//               {paymentType.growth >= 0 ? '+' : ''}{paymentType.growth}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryBreakdown;




























// import React from 'react';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip
// } from 'recharts';

// const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text 
//       x={x} 
//       y={y} 
//       fill="white" 
//       textAnchor={x > cx ? 'start' : 'end'} 
//       dominantBaseline="central"
//       fontSize={12}
//       fontWeight={600}
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// const CategoryBreakdown = ({ salesByCategory }) => {
//   const chartData = salesByCategory.map(item => ({
//     name: item.category,
//     value: item.percentage
//   }));

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h3>
      
//       <div className="h-[300px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderCustomizedLabel}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {chartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip 
//               formatter={(value) => [`${value}%`, 'Percentage']}
//             />
//             <Legend 
//               layout="vertical" 
//               verticalAlign="middle" 
//               align="right"
//               formatter={(value, entry) => {
//                 const { category, sales } = salesByCategory.find(item => item.category === value);
//                 return <span className="text-sm text-gray-700">{category} (${sales.toLocaleString()})</span>;
//               }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mt-4">
//         {salesByCategory.map(category => (
//           <div key={category.category} className="flex items-center">
//             <div className="flex-1">
//               <div className="flex items-center">
//                 <div className="mr-2 h-3 w-3 rounded-full" style={{ 
//                   backgroundColor: COLORS[salesByCategory.indexOf(category) % COLORS.length] 
//                 }} />
//                 <p className="text-sm font-medium">{category.category}</p>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">{category.orders} orders</p>
//             </div>
//             <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//               category.growth >= 0 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
//             }`}>
//               {category.growth >= 0 ? '+' : ''}{category.growth}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryBreakdown;