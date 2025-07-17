import React from 'react';
import { Mail, Phone, MapPin, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';



const PharmacyCard = ({ pharmacy, onView, onRemove }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRatingStars = (rating) => {
    if (rating === 0) return <span className="text-gray-400">Not rated</span>;
    return (
      <div className="flex items-center">
        <span className="text-yellow-400">★</span>
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="hover:shadow-lg transition-shadow">
      <div className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg">{pharmacy.name}</div>
            <p className="text-sm text-gray-500 mt-1">{pharmacy.license}</p>
          </div>
          {getStatusBadge(pharmacy.status)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {pharmacy.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {pharmacy.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {pharmacy.location}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-sm font-medium">{pharmacy.orders} orders</p>
            {getRatingStars(pharmacy.rating)}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default PharmacyCard;
