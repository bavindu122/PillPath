import React from 'react'
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import PharmacyCard from '../components/PharmacyCard';
import { Store, Activity, Ban, ClockAlert, Eye, Trash2, UserPlus, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

// ✅ Updated to match backend Pharmacy entity
const initialPharmacies = [
  {
    id: 1,
    name: 'MedPlus Pharmacy',
    address: '123 Main Street, New York, NY 10001',
    latitude: 40.7128,
    longitude: -74.0060,
    phoneNumber: '+1 (555) 123-4567',
    email: 'contact@medplus.com',
    licenseNumber: 'NY-PHARM-001234',
    licenseExpiryDate: '2025-03-15',
    logoUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center',
    logoPublicId: 'medplus_logo_123',
    bannerUrl: null,
    bannerPublicId: null,
    operatingHours: {
      monday: '8:00 AM - 10:00 PM',
      tuesday: '8:00 AM - 10:00 PM',
      wednesday: '8:00 AM - 10:00 PM',
      thursday: '8:00 AM - 10:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '9:00 AM - 9:00 PM',
      sunday: '10:00 AM - 8:00 PM'
    },
    services: ['Prescription Filling', 'Consultations', 'Delivery', 'Vaccinations'],
    isVerified: true,
    isActive: false, // Corresponds to 'Rejected' status
    deliveryAvailable: true,
    deliveryRadius: 15,
    averageRating: 4.8,
    totalReviews: 245,
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2024-01-20T14:25:00Z',
    // Frontend-specific fields for admin management
    status: 'Rejected', // Derived from isActive + isVerified
    rejectReason: 'Incomplete registration',
    suspendReason: null
  },
  {
    id: 2,
    name: 'HealthCare Pharmacy',
    address: '456 Oak Avenue, Los Angeles, CA 90210',
    latitude: 34.0522,
    longitude: -118.2437,
    phoneNumber: '+1 (555) 234-5678',
    email: 'info@healthcare-ph.com',
    licenseNumber: 'CA-PHARM-005678',
    licenseExpiryDate: '2024-12-22',
    logoUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center',
    logoPublicId: 'healthcare_logo_456',
    bannerUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=300&fit=crop',
    bannerPublicId: 'healthcare_banner_456',
    operatingHours: {
      monday: '7:00 AM - 11:00 PM',
      tuesday: '7:00 AM - 11:00 PM',
      wednesday: '7:00 AM - 11:00 PM',
      thursday: '7:00 AM - 11:00 PM',
      friday: '7:00 AM - 11:00 PM',
      saturday: '8:00 AM - 10:00 PM',
      sunday: '9:00 AM - 9:00 PM'
    },
    services: ['24/7 Emergency', 'Prescription Filling', 'Health Screenings', 'Immunizations', 'Delivery'],
    isVerified: true,
    isActive: true,
    deliveryAvailable: true,
    deliveryRadius: 20,
    averageRating: 4.6,
    totalReviews: 189,
    createdAt: '2023-01-22T08:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    status: 'Active',
    rejectReason: null,
    suspendReason: null
  },
  {
    id: 3,
    name: 'QuickMeds',
    address: '789 Pine Street, Chicago, IL 60601',
    latitude: 41.8781,
    longitude: -87.6298,
    phoneNumber: '+1 (555) 345-6789',
    email: 'support@quickmeds.com',
    licenseNumber: 'IL-PHARM-009012',
    licenseExpiryDate: '2025-01-10',
    logoUrl: null,
    logoPublicId: null,
    bannerUrl: null,
    bannerPublicId: null,
    operatingHours: {
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '10:00 AM - 8:00 PM',
      sunday: 'Closed'
    },
    services: ['Prescription Filling', 'Health Consultations'],
    isVerified: false,
    isActive: false,
    deliveryAvailable: false,
    deliveryRadius: 0,
    averageRating: 0.0,
    totalReviews: 0,
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
    status: 'Pending',
    rejectReason: null,
    suspendReason: null
  },
  {
    id: 4,
    name: 'Family Pharmacy',
    address: '321 Elm Drive, Houston, TX 77001',
    latitude: 29.7604,
    longitude: -95.3698,
    phoneNumber: '+1 (555) 456-7890',
    email: 'hello@familypharm.com',
    licenseNumber: 'TX-PHARM-003456',
    licenseExpiryDate: '2025-08-07',
    logoUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop&crop=center',
    logoPublicId: 'family_logo_789',
    bannerUrl: null,
    bannerPublicId: null,
    operatingHours: {
      monday: '8:30 AM - 8:00 PM',
      tuesday: '8:30 AM - 8:00 PM',
      wednesday: '8:30 AM - 8:00 PM',
      thursday: '8:30 AM - 8:00 PM',
      friday: '8:30 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '11:00 AM - 5:00 PM'
    },
    services: ['Family Care', 'Prescription Filling', 'Blood Pressure Checks', 'Diabetes Counseling'],
    isVerified: true,
    isActive: true,
    deliveryAvailable: true,
    deliveryRadius: 10,
    averageRating: 4.9,
    totalReviews: 156,
    createdAt: '2023-08-07T14:20:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    status: 'Active',
    rejectReason: null,
    suspendReason: null
  },
  {
    id: 5,
    name: 'Metro Pharmacy',
    address: '654 Broadway, Phoenix, AZ 85001',
    latitude: 33.4484,
    longitude: -112.0740,
    phoneNumber: '+1 (555) 567-8901',
    email: 'contact@metro-pharm.com',
    licenseNumber: 'AZ-PHARM-007890',
    licenseExpiryDate: '2025-06-30',
    logoUrl: null,
    logoPublicId: null,
    bannerUrl: null,
    bannerPublicId: null,
    operatingHours: {
      monday: '8:00 AM - 9:00 PM',
      tuesday: '8:00 AM - 9:00 PM',
      wednesday: '8:00 AM - 9:00 PM',
      thursday: '8:00 AM - 9:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM'
    },
    services: ['Prescription Filling', 'Health Monitoring', 'Senior Discounts'],
    isVerified: true,
    isActive: false, // Suspended
    deliveryAvailable: true,
    deliveryRadius: 12,
    averageRating: 4.2,
    totalReviews: 78,
    createdAt: '2023-06-30T09:45:00Z',
    updatedAt: '2024-01-10T13:15:00Z',
    status: 'Suspended',
    rejectReason: null,
    suspendReason: 'License verification issues'
  }
];

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState(initialPharmacies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [pharmacyList, setPharmacyList] = useState(pharmacies);
  const [visibleRows, setVisibleRows] = useState(12);

  // ✅ Updated filtering to work with backend structure
  const filteredPharmacies = pharmacyList.filter(pharmacy => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || pharmacy.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ✅ Updated status management to sync with backend fields
  const handleSuspend = (pharmacy, suspendReason) => {
    setPharmacyList(prev =>
      prev.map(p =>
        p.id === pharmacy.id ? { 
          ...p, 
          status: 'Suspended', 
          isActive: false,
          suspendReason 
        } : p
      )
    );
    console.log(`Suspended pharmacy: ${pharmacy.name}, Reason: ${suspendReason}`);
  };

  const handleActivate = (pharmacy) => {
    setPharmacyList(prev =>
      prev.map(p =>
        p.id === pharmacy.id ? { 
          ...p, 
          status: 'Active', 
          isActive: true,
          isVerified: true,
          suspendReason: null 
        } : p
      )
    );
    console.log(`Activated pharmacy: ${pharmacy.name}`);
  };

  const handleAcceptRegistration = (pharmacy) => {
    setPharmacyList(prev =>
      prev.map(p =>
        p.id === pharmacy.id ? { 
          ...p, 
          status: 'Active',
          isActive: true,
          isVerified: true
        } : p
      )
    );
    console.log(`Accepted registration for pharmacy: ${pharmacy.name}`);
  };

  const handleRejectRegistration = (pharmacy, reason) => {
    setPharmacyList(prev =>
      prev.map(p =>
        p.id === pharmacy.id ? { 
          ...p, 
          status: 'Rejected',
          isActive: false,
          isVerified: false,
          rejectReason: reason 
        } : p
      )
    );
    console.log(`Rejected registration for pharmacy: ${pharmacy.name}, Reason: ${reason}`);
  };

  // Get only the visible pharmacies based on visibleRows
  const visiblePharmacies = filteredPharmacies.slice(0, visibleRows);
  const hasMorePharmacies = filteredPharmacies.length > visibleRows;

  // Handle "View More" button click
  const handleViewMore = () => {
    setVisibleRows(prev => prev + 6);
  };

  // Reset visible rows when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setVisibleRows(12);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader 
        icon={Store} 
        title="Pharmacy Management" 
        subtitle="Manage all registered pharmacies on the PillPath platform." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Active Pharmacies"
          value={pharmacyList.filter(p => p.status === "Active").length}
          icon={<Activity size={48} className="text-blue-500" />}
        />
        <StatCard
          label="Rejected Pharmacies"
          value={pharmacyList.filter(p => p.status === "Rejected").length}
          icon={<TriangleAlert size={48} className="text-gray-500" />}
        />
        <StatCard
          label="Pending Approval"
          value={pharmacyList.filter(p => p.status === "Pending").length}
          icon={<ClockAlert size={48} className="text-yellow-500" />}
        />
        <StatCard
          label="Suspended Pharmacies"
          value={pharmacyList.filter(p => p.status === "Suspended").length}
          icon={<Ban size={48} className="text-red-500" />}
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={handleFilterChange(setSearchTerm)}
        filterValue={filterStatus}
        setFilterValue={handleFilterChange(setFilterStatus)}
        placeholder="Search by name, email, address, or license..."
        filterOptions={['All', 'Active', 'Pending', 'Suspended', 'Rejected']}
      />

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePharmacies.map(pharmacy => (
            <PharmacyCard
              key={pharmacy.id}
              pharmacy={pharmacy}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
              onAcceptRegistration={handleAcceptRegistration}
              onRejectRegistration={handleRejectRegistration}
            />
          ))}
        </div>

        {hasMorePharmacies && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleViewMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>View More ({Math.min(6, filteredPharmacies.length - visibleRows)} more)</span>
            </button>
          </div>
        )}

        {/* Show total count */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {visiblePharmacies.length} of {filteredPharmacies.length} pharmacies
        </div>
      </div>
    </div>
  )
}

export default Pharmacies