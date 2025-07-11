import React from "react";
import DetailCard from "../DetailCard";
import Button from "../Button";
import { Pill } from "lucide-react";

const CurrentPrescriptionsCard = () => (
  <DetailCard className="text-left">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Pill className="text-blue-500" size={24} />
        Current Prescriptions
      </h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium">Metformin 500mg</p>
          <p className="text-sm text-gray-500">Twice daily • 5 days remaining</p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ready</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium">Lisinopril 10mg</p>
          <p className="text-sm text-gray-500">Once daily • 12 days remaining</p>
        </div>
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Processing</span>
      </div>
      <Button className="w-full text-sm">View All</Button>
    </div>
  </DetailCard>
);

export default CurrentPrescriptionsCard;
