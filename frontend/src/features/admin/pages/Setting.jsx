import PageHeader from '../components/PageHeader';

import React, { useState } from 'react';
import {
  UserPlus, Settings, Lock, List, Trash2, CheckCircle, XCircle, DollarSign, Home
} from 'lucide-react';

// Dummy Data for Admin Settings
const dummySettingsData = {
  moderators: [
    { id: 'mod_001', username: 'moderator1', lastLogin: '2024-07-15 10:30 AM' },
    { id: 'mod_002', username: 'content_mod', lastLogin: '2024-07-18 02:00 PM' },
    { id: 'mod_003', username: 'support_mod', lastLogin: '2024-07-17 09:15 AM' },
  ],
  generalSettings: {
    siteName: 'PillPath',
    contactEmail: 'support@pillpath.com',
    notificationsEnabled: true,
  },
  commissionSettings: [
    { id: 'tier_001', minAmount: 0, maxAmount: 10000, rate: 0.10 }, // 10% for <= 10000
    { id: 'tier_002', minAmount: 10000.01, maxAmount: Infinity, rate: 0.07 }, // 7% for > 10000
  ],
  auditLog: [
    { id: 'log_001', action: 'Added moderator: moderator1', timestamp: '2024-07-15 10:35 AM', admin: 'SuperAdmin' },
    { id: 'log_002', action: 'Updated site name to PillPath', timestamp: '2024-07-14 09:00 AM', admin: 'SuperAdmin' },
    { id: 'log_003', action: 'Changed password for moderator1', timestamp: '2024-07-15 10:40 AM', admin: 'SuperAdmin' },
  ]
};

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
