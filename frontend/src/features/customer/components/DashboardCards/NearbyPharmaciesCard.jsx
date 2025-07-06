import React from "react";
import DetailCard from "../DetailCard";
import Button from "../Button";
import { MapPin } from "lucide-react";

const NearbyPharmaciesCard = () => (
  <DetailCard className="text-left">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <MapPin className="text-green-500" size={24} />
        Nearby Pharmacies
      </h3>
    </div>
    <div className="space-y-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="font-medium">Central Pharmacy</p>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>
        </div>
        <p className="text-sm text-gray-500">0.5 km away • Open until 10 PM</p>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="font-medium">HealthCare Plus</p>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>
        </div>
        <p className="text-sm text-gray-500">1.2 km away • 24/7 Service</p>
      </div>
      <Button className="w-full text-sm">Find More</Button>
    </div>
  </DetailCard>
);

export default NearbyPharmaciesCard;
