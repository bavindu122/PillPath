import React from "react";
import DetailCard from "../DetailCard";
import { Package } from "lucide-react";

const RecentOrdersCard = () => (
  <DetailCard className="text-left">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Package className="text-purple-500" size={24} />
        Recent Orders
      </h3>
    </div>
    <div className="space-y-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="font-medium">Order #PX-2024-001</p>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Out for Delivery</span>
        </div>
        <p className="text-sm text-gray-500">Central Pharmacy • Estimated delivery: 2 hours</p>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="font-medium">Order #PX-2024-002</p>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Ready</span>
        </div>
        <p className="text-sm text-gray-500">HealthCare Pharmacy • Ready for pickup</p>
      </div>
    </div>
  </DetailCard>
);

export default RecentOrdersCard;
