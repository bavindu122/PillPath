import React from 'react'
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import PharmacyCard from '../components/PharmacyCard';
import { Store,Activity,Ban,ClockAlert ,Eye,Trash2,UserPlus} from 'lucide-react';
import { useState } from 'react';

const pharmacies = [
  {
    id: 1,
    name: 'MedPlus Pharmacy',
    tradingName: 'MedPlus',
    owner: 'John Doe',
    email: 'contact@medplus.com',
    phone: '+1 (555) 123-4567',
    websiteLink: 'https://www.medplus.com',
    location: 'New York, NY',
    status: 'Active',
    joinDate: '2023-03-15',
    orders: 245,
    rating: 4.8,
    businessRegistration: '123456789',
    license: 'NY-PHARM-001234',
    licenseExpiry: '2025-03-15',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
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
    licenseExpiry: '2024-01-22',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
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
    licenseExpiry: '2025-01-10',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
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
    licenseExpiry: '2025-08-07',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
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
    licenseExpiry: '2025-06-30',
    pharmacist:'Jony Doe',
    pharmacistContact: '+1 (555) 987-6543',
    pharmacistLicense: 'CA-PHARM-005678',
    secondaryPharmacist:'Jony Doe',
  }
];

const Pharmacies = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [pharmacyList, setPharmacyList] = useState(pharmacies);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">

        <PageHeader 
            icon={Store} 
            title="Pharmacy Management" 
            subtitle="Manage all registered pharmacies on the PillPath platform." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard
                label="Active Pharmacies"
                value={pharmacyList.filter(p => p.status === "Active").length}
                icon={<Activity size={48} className="text-blue-500" />}
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
            filterOptions={['All', 'Active', 'Pending', 'Suspended']}
        />
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map(pharmacy => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onSuspend={handleSuspend}
                onActivate={handleActivate}
                onAcceptRegistration={handleAcceptRegistration}
                
              />
            ))}
         </div>
      </div>
    </div>
  )
}

export default Pharmacies
