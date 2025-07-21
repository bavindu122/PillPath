import PageHeader from '../components/PageHeader';

import React, { useState } from 'react';
import {
  UserPlus, Settings, Lock, List, Trash2, CheckCircle, XCircle, DollarSign, Home,LogOut
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

const [moderators, setModerators] = useState(dummySettingsData.moderators);
  const [newModeratorUsername, setNewModeratorUsername] = useState('');
  const [newModeratorPassword, setNewModeratorPassword] = useState('');
  const [generalSettings, setGeneralSettings] = useState(dummySettingsData.generalSettings);
  const [commissionSettings, setCommissionSettings] = useState(dummySettingsData.commissionSettings);
  const [auditLog, setAuditLog] = useState(dummySettingsData.auditLog);

  const [passwordChangeOld, setPasswordChangeOld] = useState('');
  const [passwordChangeNew, setPasswordChangeNew] = useState('');
  const [passwordChangeConfirm, setPasswordChangeConfirm] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const [newCommissionMin, setNewCommissionMin] = useState('');
  const [newCommissionMax, setNewCommissionMax] = useState('');
  const [newCommissionRate, setNewCommissionRate] = useState('');
  const [editCommissionId, setEditCommissionId] = useState(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  const handleAddModerator = (e) => {
    e.preventDefault();
    if (newModeratorUsername.trim() === '' || newModeratorPassword.trim() === '') {
      // In a real application, replace alert with a custom modal/toast
      alert('Username and password cannot be empty.');
      return;
    }

    const newMod = {
      id: `mod_${Date.now()}`, // Simple unique ID
      username: newModeratorUsername,
      lastLogin: 'Never', // New moderator hasn't logged in yet
    };
    setModerators([...moderators, newMod]);
    setAuditLog([{ id: `log_${Date.now()}`, action: `Added moderator: ${newModeratorUsername}`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
    setNewModeratorUsername('');
    setNewModeratorPassword('');
    // In a real application, replace alert with a custom modal/toast
    alert(`Moderator '${newModeratorUsername}' added successfully! Password: '${newModeratorPassword}' (Please note this down securely, as it will not be displayed again).`);
  };

  const handleDeleteModerator = (id, username) => {
    // In a real application, replace window.confirm with a custom modal
    if (window.confirm(`Are you sure you want to delete moderator '${username}'?`)) {
      setModerators(moderators.filter(mod => mod.id !== id));
      setAuditLog([{ id: `log_${Date.now()}`, action: `Deleted moderator: ${username}`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
    }
  };

  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdateGeneralSettings = () => {
    setAuditLog([{ id: `log_${Date.now()}`, action: `Updated general settings`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
    // In a real application, replace alert with a custom modal/toast
    alert('General settings updated!');
  };

  const handleChangeAdminPassword = (e) => {
    e.preventDefault();
    setPasswordChangeMessage('');

    if (passwordChangeOld === '' || passwordChangeNew === '' || passwordChangeConfirm === '') {
      setPasswordChangeMessage('All password fields are required.');
      return;
    }
    if (passwordChangeNew !== passwordChangeConfirm) {
      setPasswordChangeMessage('New password and confirm password do not match.');
      return;
    }
    if (passwordChangeNew.length < 6) { // Example minimum length
      setPasswordChangeMessage('New password must be at least 6 characters long.');
      return;
    }
    // In a real application, you would verify old password with backend
    // and then update the password securely.
    if (passwordChangeOld !== 'adminpass') { // Dummy old password check
        setPasswordChangeMessage('Incorrect old password.');
        return;
    }

    // Simulate password change success
    setPasswordChangeMessage('Password changed successfully!');
    setAuditLog([{ id: `log_${Date.now()}`, action: `Admin password changed`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
    setPasswordChangeOld('');
    setPasswordChangeNew('');
    setPasswordChangeConfirm('');
  };

  const handleAddOrUpdateCommissionTier = (e) => {
    e.preventDefault();
    const min = parseFloat(newCommissionMin);
    const max = newCommissionMax === '' ? Infinity : parseFloat(newCommissionMax);
    const rate = parseFloat(newCommissionRate);

    if (isNaN(min) || isNaN(rate) || rate <= 0 || rate > 1 || (max !== Infinity && isNaN(max))) {
      alert('Please enter valid numbers for min amount, max amount (or leave blank for no max), and a rate between 0 and 1 (e.g., 0.10 for 10%).');
      return;
    }
    if (max !== Infinity && min >= max) {
        alert('Minimum amount must be less than maximum amount.');
        return;
    }

    if (editCommissionId) {
      // Update existing tier
      setCommissionSettings(prevSettings =>
        prevSettings.map(tier =>
          tier.id === editCommissionId ? { ...tier, minAmount: min, maxAmount: max, rate: rate } : tier
        ).sort((a, b) => a.minAmount - b.minAmount) // Keep sorted
      );
      setAuditLog([{ id: `log_${Date.now()}`, action: `Updated commission tier: ${editCommissionId}`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
      setEditCommissionId(null);
      alert('Commission tier updated successfully!');
    } else {
      // Add new tier
      const newTier = {
        id: `tier_${Date.now()}`,
        minAmount: min,
        maxAmount: max,
        rate: rate,
      };
      setCommissionSettings(prevSettings =>
        [...prevSettings, newTier].sort((a, b) => a.minAmount - b.minAmount) // Keep sorted
      );
      setAuditLog([{ id: `log_${Date.now()}`, action: `Added commission tier: ${min}-${max} @ ${rate}`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
      alert('Commission tier added successfully!');
    }
    setNewCommissionMin('');
    setNewCommissionMax('');
    setNewCommissionRate('');
  };

  const handleEditCommissionTier = (tier) => {
    setNewCommissionMin(tier.minAmount);
    setNewCommissionMax(tier.maxAmount === Infinity ? '' : tier.maxAmount);
    setNewCommissionRate(tier.rate);
    setEditCommissionId(tier.id);
  };

  const handleDeleteCommissionTier = (id) => {
    if (window.confirm('Are you sure you want to delete this commission tier?')) {
      setCommissionSettings(prevSettings => prevSettings.filter(tier => tier.id !== id));
      setAuditLog([{ id: `log_${Date.now()}`, action: `Deleted commission tier: ${id}`, timestamp: new Date().toLocaleString(), admin: 'SuperAdmin' }, ...auditLog]);
      alert('Commission tier deleted successfully!');
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setLogoutMessage('Logging out...');
    setTimeout(() => {
      setLogoutMessage('Redirecting to home page...');
      // In a real application, you would perform actual logout (e.g., clear tokens)
      // and then redirect using window.location.href or a router.
      // For this isolated component, we'll just show the message.
      setTimeout(() => {
        // Simulate redirect by clearing content and showing final message
        setLogoutMessage('You have been logged out. Redirecting to home page...');
        window.location.href = '/';
      }, 1500); // Simulate redirect delay
    }, 1000); // Simulate logout process delay
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-inter">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">
            {logoutMessage}
          </h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="flex items-center justify-between mb-8">
            <PageHeader 
                icon={Settings} 
                title="Admin Settings" 
                subtitle="Manage system configurations and user roles." 
            />

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                <LogOut className="w-5 h-5 mr-2" /> Logout
            </button>
        </div>

     
      {/* Add Moderator Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-blue-600" /> Add New Moderator
        </h2>
        <form onSubmit={handleAddModerator} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="modUsername" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              id="modUsername"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newModeratorUsername}
              onChange={(e) => setNewModeratorUsername(e.target.value)}
              placeholder="Enter moderator username"
              required
            />
          </div>
          <div>
            <label htmlFor="modPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="text" // Changed to 'text' for demonstration to show generated password
              id="modPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newModeratorPassword}
              onChange={(e) => setNewModeratorPassword(e.target.value)}
              placeholder="Enter temporary password"
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Add Moderator
            </button>
          </div>
        </form>
      </section>

      {/* Existing Moderators Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <List className="w-6 h-6 mr-2 text-blue-600" /> Existing Moderators
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {moderators.map((mod) => (
                <tr key={mod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mod.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mod.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteModerator(mod.id, mod.username)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                    >
                      <Trash2 className="w-5 h-5 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* General Settings Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-purple-600" /> General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={generalSettings.siteName}
              onChange={handleGeneralSettingsChange}
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={generalSettings.contactEmail}
              onChange={handleGeneralSettingsChange}
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={generalSettings.notificationsEnabled}
              onChange={handleGeneralSettingsChange}
            />
            <label htmlFor="notificationsEnabled" className="ml-2 block text-sm font-medium text-gray-700">Enable System Notifications</label>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleUpdateGeneralSettings}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Save Settings
            </button>
          </div>
        </div>
      </section>

      {/* Commission Settings Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-indigo-600" /> Commission Rate Settings
        </h2>
        <form onSubmit={handleAddOrUpdateCommissionTier} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 items-end">
          <div>
            <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">Min Amount ($)</label>
            <input
              type="number"
              id="minAmount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newCommissionMin}
              onChange={(e) => setNewCommissionMin(e.target.value)}
              placeholder="e.g., 0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">Max Amount ($) (Leave blank for no max)</label>
            <input
              type="number"
              id="maxAmount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newCommissionMax}
              onChange={(e) => setNewCommissionMax(e.target.value)}
              placeholder="e.g., 10000"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">Rate (e.g., 0.10 for 10%)</label>
            <input
              type="number"
              id="rate"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newCommissionRate}
              onChange={(e) => setNewCommissionRate(e.target.value)}
              placeholder="e.g., 0.10"
              step="0.01"
              min="0"
              max="1"
              required
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              {editCommissionId ? <CheckCircle className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
              {editCommissionId ? 'Update Tier' : 'Add New Tier'}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissionSettings.map((tier) => (
                <tr key={tier.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tier.minAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tier.maxAmount === Infinity ? 'No Max' : tier.maxAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(tier.rate * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => handleEditCommissionTier(tier)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCommissionTier(tier.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* Security Settings Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <Lock className="w-6 h-6 mr-2 text-red-600" /> Security Settings
        </h2>
        <form onSubmit={handleChangeAdminPassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={passwordChangeOld}
              onChange={(e) => setPasswordChangeOld(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={passwordChangeNew}
              onChange={(e) => setNewPasswordChangeNew(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={passwordChangeConfirm}
              onChange={(e) => setPasswordChangeConfirm(e.target.value)}
              required
            />
          </div>
          {passwordChangeMessage && (
            <div className={`md:col-span-2 p-3 rounded-lg text-sm ${
              passwordChangeMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {passwordChangeMessage}
            </div>
          )}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Lock className="w-5 h-5 mr-2" /> Change Password
            </button>
          </div>
        </form>
      </section>

      {/* Audit Log Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <List className="w-6 h-6 mr-2 text-blue-600" /> Audit Log
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLog.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>

      
    
  )
}

export default Setting
