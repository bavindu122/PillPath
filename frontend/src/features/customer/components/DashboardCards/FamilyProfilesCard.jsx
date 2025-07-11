import React from "react";
import DetailCard from "../DetailCard";
import Button from "../Button";
import { Users } from "lucide-react";

const FamilyProfilesCard = () => (
  <DetailCard className="text-left">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Users className="text-indigo-500" size={24} />
        Family Profiles
      </h3>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">M</div>
        <div>
          <p className="font-medium">Maria Silva</p>
          <p className="text-sm text-gray-500">2 active prescriptions</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">A</div>
        <div>
          <p className="font-medium">Alex Silva</p>
          <p className="text-sm text-gray-500">1 active prescription</p>
        </div>
      </div>
      <Button className="w-full text-sm">Manage Family</Button>
    </div>
  </DetailCard>
);

export default FamilyProfilesCard;
