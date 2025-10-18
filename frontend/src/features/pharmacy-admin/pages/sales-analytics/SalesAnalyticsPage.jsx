import React from "react";
import { useSalesData } from "../../hooks/useSalesData";
import SalesSummaryCard from "../../components/SalesAnalytics/SalesSummaryCard";
import SalesChart from "../../components/SalesAnalytics/SalesChart";
import TopProductsTable from "../../components/SalesAnalytics/TopProductsTable";
import CategoryBreakdown from "../../components/SalesAnalytics/CategoryBreakdown"; // This will be repurposed for payment breakdown
import usePharmacyWallet from "../../hooks/usePharmacyWallet";
import { useAuth } from "../../../../hooks/useAuth";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Import icons if you have them
const DollarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.2a.75.75 0 000 1.5h.5a5.002 5.002 0 009.8 1.5h.75a.75.75 0 000-1.5h-1.305a5.03 5.03 0 00-.1-.85h.405a.75.75 0 000-1.5h-.5a5.002 5.002 0 00-9.8-1.5h-.75a.75.75 0 000 1.5h1.305c.066.275.1.562.1.85h-.405a.75.75 0 000 1.5h.2a4.357 4.357 0 01-.1 1.085V13.5a4 4 0 004.767 3.943.75.75 0 00-.274-1.476A2.501 2.501 0 018 13.5v-.165c0-.364.034-.728.1-1.085h3.8a.75.75 0 000-1.5h-4a.75.75 0 010-1.5h1.5a2.5 2.5 0 012.732 1.232.75.75 0 001.06-1.06A4.001 4.001 0 0010 8.5v-.25a.75.75 0 00-1.5 0v.25a4.357 4.357 0 01-.1 1.085H8a.75.75 0 000 1.5h.5z"
      clipRule="evenodd"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

const PercentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.2a.75.75 0 000 1.5h.5c0 .013 0 .026.002.039a4.038 4.038 0 001.23 2.62l-.471.469a.75.75 0 101.06 1.06l.468-.468a4.5 4.5 0 01-.073-.366H12a.75.75 0 000-1.5h-.93a4.5 4.5 0 01-.175-.852h1.105a.75.75 0 000-1.5H10.5a4.5 4.5 0 00-.376-.875.75.75 0 00-1.248.83c.124.211.232.433.32.66h-.92a.75.75 0 000 1.5h.797c.042.283.064.571.064.863a3.612 3.612 0 01-.36.473 3.85 3.85 0 00-1.013-.54 2.5 2.5 0 01-.45-.176h.142a.75.75 0 100-1.5h-.5a.75.75 0 00-.75.75v.325c0 .138.112.25.25.25h.5a.75.75 0 01.75.75v.325c0 .138-.112.25-.25.25h-.5a.75.75 0 000 1.5h.142c-.128-.072-.297-.144-.45-.177z"
      clipRule="evenodd"
    />
  </svg>
);

const ReceiptIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M4.93 1.31a41.401 41.401 0 0110.14 0C16.194 1.45 17 2.414 17 3.517V18.25a.75.75 0 01-1.075.676l-2.8-1.344-2.8 1.344a.75.75 0 01-.65 0l-2.8-1.344-2.8 1.344A.75.75 0 013 18.25V3.517c0-1.103.806-2.068 1.93-2.207zm8.85 5.97a.75.75 0 00-1.06-1.06l-6.5 6.5a.75.75 0 101.06 1.06l6.5-6.5zM9 8a1 1 0 11-2 0 1 1 0 012 0zm3 5a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const SalesAnalyticsPage = () => {
  const {
    salesSummary,
    chartData,
    timeRange,
    setTimeRange,
    comparisonEnabled,
    setComparisonEnabled,
    selectedCategory,
    setSelectedCategory,
    topSellingProducts,
    // salesByCategory, // No longer directly used here for breakdown
    paymentDistribution, // New prop for payment type breakdown
    categories, // Updated categories for dropdown
  } = useSalesData();

  // Wallet transactions for pharmacy admin
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId || user?.pharmacy?.id || user?.id;
  const {
    balance: walletBalance,
    transactions: walletTx,
    loading: walletLoading,
    error: walletError,
  } = usePharmacyWallet({ page: 0, size: 10, pharmacyId });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
          <p className="mt-1 text-gray-500">
            Track and analyze your pharmacy's sales performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={comparisonEnabled}
              onChange={() => setComparisonEnabled(!comparisonEnabled)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            Compare with previous period
          </label>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SalesSummaryCard
          title="Total Sales"
          value={salesSummary.totalSales.toLocaleString()}
          prefix="Rs."
          change={salesSummary.salesGrowth}
          icon={DollarIcon}
        />
        <SalesSummaryCard
          title="Total Orders"
          value={salesSummary.totalOrders.toLocaleString()}
          change={salesSummary.ordersGrowth}
          icon={CartIcon}
        />
        <SalesSummaryCard
          title="Average Order Value"
          value={salesSummary.averageOrderValue.toFixed(2)}
          prefix="Rs."
          change={(
            salesSummary.salesGrowth - salesSummary.ordersGrowth
          ).toFixed(1)}
          icon={ReceiptIcon}
        />
        <SalesSummaryCard
          title="Customer Purchase Rate"
          value={salesSummary.conversionRate}
          suffix="%"
          change="2.5"
          icon={PercentIcon}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SalesChart
            data={chartData}
            timeRange={timeRange}
            comparisonEnabled={comparisonEnabled}
          />
        </div>
        <div>
          {/* CategoryBreakdown now receives paymentDistribution */}
          <CategoryBreakdown salesByCategory={paymentDistribution} />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="mb-6">
        <TopProductsTable products={topSellingProducts} />
      </div>

      {/* Wallet Transactions Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Wallet Transactions
          </h3>
          {walletBalance && (
            <div className="text-sm text-gray-600">
              Balance: {walletBalance.currency || "LKR"}{" "}
              {Number(walletBalance.available ?? 0).toFixed(2)}
            </div>
          )}
          {walletError && (
            <div className="text-sm text-red-600">{walletError}</div>
          )}
        </div>
        {walletLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : !walletTx?.length ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">No wallet transactions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Txn ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {walletTx.map((t) => (
                  <tr
                    key={t.transactionId || t.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {t.transactionId || t.id}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-xs font-medium">
                      <span className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          t.direction === "CREDIT"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.direction === "CREDIT" ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                        {t.direction}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold">
                      {t.currency || "LKR"} {Number(t.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {t.orderCode || "—"}
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-gray-600 max-w-[30ch] truncate"
                      title={t.description || t.note}
                    >
                      {t.description || t.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesAnalyticsPage;

// import React from 'react';
// import { useSalesData } from '../../hooks/useSalesData';
// import SalesSummaryCard from '../../components/SalesAnalytics/SalesSummaryCard';
// import SalesChart from '../../components/SalesAnalytics/SalesChart';
// import TopProductsTable from '../../components/SalesAnalytics/TopProductsTable';
// import CategoryBreakdown from '../../components/SalesAnalytics/CategoryBreakdown';

// // Import icons if you have them
// const DollarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
//     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.2a.75.75 0 000 1.5h.5a5.002 5.002 0 009.8 1.5h.75a.75.75 0 000-1.5h-1.305a5.03 5.03 0 00-.1-.85h.405a.75.75 0 000-1.5h-.5a5.002 5.002 0 00-9.8-1.5h-.75a.75.75 0 000 1.5h1.305c.066.275.1.562.1.85h-.405a.75.75 0 000 1.5h.2a4.357 4.357 0 01-.1 1.085V13.5a4 4 0 004.767 3.943.75.75 0 00-.274-1.476A2.501 2.501 0 018 13.5v-.165c0-.364.034-.728.1-1.085h3.8a.75.75 0 000-1.5h-4a.75.75 0 010-1.5h1.5a2.5 2.5 0 012.732 1.232.75.75 0 001.06-1.06A4.001 4.001 0 0010 8.5v-.25a.75.75 0 00-1.5 0v.25a4.357 4.357 0 01-.1 1.085H8a.75.75 0 000 1.5h.5z" clipRule="evenodd" />
//   </svg>
// );

// const CartIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
//     <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//   </svg>
// );

// const PercentIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
//     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.732 6.232a2.5 2.5 0 013.536 0 .75.75 0 101.06-1.06A4 4 0 006.5 8v.165c0 .364.034.728.1 1.085h-.2a.75.75 0 000 1.5h.5c0 .013 0 .026.002.039a4.038 4.038 0 001.23 2.62l-.471.469a.75.75 0 101.06 1.06l.468-.468a4.5 4.5 0 01-.073-.366H12a.75.75 0 000-1.5h-.93a4.5 4.5 0 01-.175-.852h1.105a.75.75 0 000-1.5H10.5a4.5 4.5 0 00-.376-.875.75.75 0 00-1.248.83c.124.211.232.433.32.66h-.92a.75.75 0 000 1.5h.797c.042.283.064.571.064.863a3.612 3.612 0 01-.36.473 3.85 3.85 0 00-1.013-.54 2.5 2.5 0 01-.45-.176h.142a.75.75 0 100-1.5h-.5a.75.75 0 00-.75.75v.325c0 .138.112.25.25.25h.5a.75.75 0 01.75.75v.325c0 .138-.112.25-.25.25h-.5a.75.75 0 000 1.5h.142c-.128-.072-.297-.144-.45-.177z" clipRule="evenodd" />
//   </svg>
// );

// const ReceiptIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
//     <path fillRule="evenodd" d="M4.93 1.31a41.401 41.401 0 0110.14 0C16.194 1.45 17 2.414 17 3.517V18.25a.75.75 0 01-1.075.676l-2.8-1.344-2.8 1.344a.75.75 0 01-.65 0l-2.8-1.344-2.8 1.344A.75.75 0 013 18.25V3.517c0-1.103.806-2.068 1.93-2.207zm8.85 5.97a.75.75 0 00-1.06-1.06l-6.5 6.5a.75.75 0 101.06 1.06l6.5-6.5zM9 8a1 1 0 11-2 0 1 1 0 012 0zm3 5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//   </svg>
// );

// const SalesAnalyticsPage = () => {
//   const {
//     salesSummary,
//     chartData,
//     timeRange,
//     setTimeRange,
//     comparisonEnabled,
//     setComparisonEnabled,
//     selectedCategory,
//     setSelectedCategory,
//     topSellingProducts,
//     salesByCategory,
//     categories
//   } = useSalesData();

//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
//           <p className="mt-1 text-gray-500">Track and analyze your pharmacy's sales performance</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <select
//             className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//           >
//             <option value="week">Last 7 days</option>
//             <option value="month">Last 30 days</option>
//             <option value="year">Last 12 months</option>
//           </select>

//           <select
//             className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             {categories.map(category => (
//               <option key={category} value={category}>
//                 {category === 'all' ? 'All Categories' : category}
//               </option>
//             ))}
//           </select>

//           <label className="flex items-center gap-2 text-sm text-gray-600">
//             <input
//               type="checkbox"
//               checked={comparisonEnabled}
//               onChange={() => setComparisonEnabled(!comparisonEnabled)}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             Compare with previous period
//           </label>
//         </div>
//       </div>

//       {/* KPI Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//         <SalesSummaryCard
//           title="Total Sales"
//           value={salesSummary.totalSales.toLocaleString()}
//           prefix="$"
//           change={salesSummary.salesGrowth}
//           icon={DollarIcon}
//         />
//         <SalesSummaryCard
//           title="Total Orders"
//           value={salesSummary.totalOrders.toLocaleString()}
//           change={salesSummary.ordersGrowth}
//           icon={CartIcon}
//         />
//         <SalesSummaryCard
//           title="Average Order Value"
//           value={salesSummary.averageOrderValue.toFixed(2)}
//           prefix="$"
//           change={(salesSummary.salesGrowth - salesSummary.ordersGrowth).toFixed(1)}
//           icon={ReceiptIcon}
//         />
//         <SalesSummaryCard
//           title="Customer Purchase Rate"
//           value={salesSummary.conversionRate}
//           suffix="%"
//           change="2.5"
//           icon={PercentIcon}
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         <div className="lg:col-span-2">
//           <SalesChart
//             data={chartData}
//             timeRange={timeRange}
//             comparisonEnabled={comparisonEnabled}
//           />
//         </div>
//         <div>
//           <CategoryBreakdown salesByCategory={salesByCategory} />
//         </div>
//       </div>

//       {/* Top Products Table */}
//       <div className="mb-6">
//         <TopProductsTable products={topSellingProducts} />
//       </div>
//     </>
//   );
// };

// export default SalesAnalyticsPage;
