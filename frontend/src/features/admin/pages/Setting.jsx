import React from 'react'
import PageHeader from '../components/PageHeader';
import { Home,Settings } from 'lucide-react'

const Setting = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <PageHeader 
        icon={Settings} 
        title="Admin Settings" 
        subtitle="Manage system configurations and user roles.

" 
      />
    </div>
  )
}

export default Setting
