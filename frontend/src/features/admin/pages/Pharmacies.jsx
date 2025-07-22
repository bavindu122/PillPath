import React from 'react'
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import PharmacyCard from '../components/PharmacyCard';
import { Store,Activity,Ban,ClockAlert ,Eye,Trash2,UserPlus,TriangleAlert} from 'lucide-react';
import { useState } from 'react';

const initialPharmacies = [
  {
    id: 1,
    name: 'MedPlus Pharmacy',
    tradingName: 'MedPlus',
    owner: 'John Doe',
    email: 'contact@medplus.com',
    phone: '+1 (555) 123-4567',
    websiteLink: 'https://www.medplus.com',
    location: 'New York, NY',
    status: 'Rejected',
    joinDate: '2023-03-15',
    orders: 245,
    rating: 4.8,
    businessRegistration: '123456789',
    rejectReason: 'Incomplete registration',
    license: 'NY-PHARM-001234',
    issueDate: '2020-01-01',
    licenseExpiry: '2025-03-15',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center',
  },
  {
    id: 2,
    name: 'HealthCare Pharmacy',
    tradingName: 'HealthCare',
    owner: 'Jane Smith',
    email: 'info@healthcare-ph.com',
    phone: '+1 (555) 234-5678',
    websiteLink: 'https://www.healthcare-ph.com',
    location: 'Los Angeles, CA',
    status: 'Active',
    joinDate: '2023-01-22',
    orders: 189,
    rating: 4.6,
    businessRegistration: '987654321',
    license: 'CA-PHARM-005678',
    issueDate: '2020-02-15',
    licenseExpiry: '2024-01-22',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center',
  },
  {
    id: 3,
    name: 'QuickMeds',
    tradingName: 'QuickMeds',
    owner: 'Mike Johnson',
    email: 'support@quickmeds.com',
    phone: '+1 (555) 345-6789',
    websiteLink: 'https://www.quickmeds.com',
    location: 'Chicago, IL',
    status: 'Pending',
    joinDate: '2024-01-10',
    orders: 0,
    rating: 0,
    license: 'IL-PHARM-009012',
    issueDate: '2020-03-01',
    licenseExpiry: '2025-01-10',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
    // No image provided - will show building icon
  },
  {
    id: 4,
    name: 'Family Pharmacy',
    owner: 'Emily Davis',
    email: 'hello@familypharm.com',
    phone: '+1 (555) 456-7890',
    location: 'Houston, TX',
    status: 'Active',
    joinDate: '2023-08-07',
    orders: 156,
    rating: 4.9,
    license: 'TX-PHARM-003456',
    issueDate: '2020-05-20',
    licenseExpiry: '2025-08-07',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop&crop=center',
  },
  {
    id: 5,
    name: 'Metro Pharmacy',
    tradingName: 'Metro Pharm',
    owner: 'Sarah Wilson',
    email: 'contact@metro-pharm.com',
    phone: '+1 (555) 567-8901',
    websiteLink: 'https://www.metro-pharm.com',
    location: 'Phoenix, AZ',
    status: 'Suspended',
    joinDate: '2023-06-30',
    orders: 78,
    rating: 4.2,
    license: 'AZ-PHARM-007890',
    issueDate: '2020-04-10',
    licenseExpiry: '2025-06-30',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
    // No image provided - will show building icon
  }
];

const Pharmacies = () => {

    const [pharmacies, setPharmacies] = useState(initialPharmacies);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [pharmacyList, setPharmacyList] = useState(pharmacies);
    const [visibleRows, setVisibleRows] = useState(12);

    const filteredPharmacies = pharmacyList.filter(pharmacy => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || pharmacy.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

    const handleSuspend = (pharmacy, suspendReason) => {
        setPharmacyList(prev =>
            prev.map(p =>
                p.id === pharmacy.id ? { ...p, status: 'Suspended', suspendReason } : p
            )
        );
        console.log(`Suspended pharmacy: ${pharmacy.name}, Reason: ${suspendReason}`);
    };

    const handleActivate = (pharmacy) => {
        setPharmacyList(prev =>
            prev.map(p =>
                p.id === pharmacy.id ? { ...p, status: 'Active', suspendReason: null } : p
            )
        );
        console.log(`Activated pharmacy: ${pharmacy.name}`);
    };

    const handleAcceptRegistration = (pharmacy) => {
        setPharmacyList(prev =>
            prev.map(p =>
                p.id === pharmacy.id ? { ...p, status: 'Active' } : p
            )
        );
        console.log(`Accepted registration for pharmacy: ${pharmacy.name}`);
    };

    const handleRejectRegistration = (pharmacy, reason) => {
      setPharmacyList(prev =>
            prev.map(p =>
                p.id === pharmacy.id ? { ...p, status: 'Rejected', suspendReason: reason } : p
            )
        );
        console.log(`Rejected registration for pharmacy: ${pharmacy.name}`);
    }


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
            setSearchTerm={setSearchTerm}
            filterValue={filterStatus}
            setFilterValue={setFilterStatus}
            placeholder="Search by name or email..."
            filterOptions={['All', 'Active', 'Pending', 'Suspended','Rejected']}
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
                <span>View More ({Math.min(10, filteredPharmacies.length - visibleRows)} more)</span>
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
