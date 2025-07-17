import React from 'react'
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import {FileText} from 'lucide-react';

const Prescription = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">

        <PageHeader 
            icon={FileText} 
            title="Prescriptions Management" 
            subtitle="Monitor and manage all prescription orders." 
        />
      
    </div>
  )
}

export default Prescription
