import React from 'react'
import PageHeader from '../components/PageHeader'
import { User, Users } from 'lucide-react'

const Overview = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <PageHeader 
        icon={Users} 
        title="User Management" 
        subtitle="Manage all registered users on the PillPath platform." 
      />
      
    </div>
  )
}

export default Overview
