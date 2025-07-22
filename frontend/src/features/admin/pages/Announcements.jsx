import React from 'react'
import PageHeader from '../components/PageHeader';
import { PlusCircle, Edit, Trash2, Bell, Search, XCircle, CheckCircle } from 'lucide-react'; // Added XCircle and CheckCircle
import { useState } from 'react';
import { useEffect } from 'react';

// Mock Data for Announcements
const mockAnnouncements = [
  { id: 'ann001', title: 'System Maintenance Scheduled', content: 'PillPath will undergo scheduled maintenance on 2023-09-01 from 2 AM to 4 AM UTC. Services may be temporarily unavailable.', date: '2023-08-25', expiryDate: '2023-09-01', status: 'Active' },
  { id: 'ann002', title: 'New Feature: Family Profiles', content: 'Exciting news! You can now manage healthcare for your entire family under one account. Check out the new "Family Profiles" section!', date: '2023-08-01', expiryDate: null, status: 'Active' },
  { id: 'ann003', title: 'Holiday Hours Update', content: 'Pharmacies may have adjusted operating hours during the upcoming holiday season. Please check individual pharmacy pages for details.', date: '2022-12-10', expiryDate: '2023-01-05', status: 'Archived' },
];


const Announcements = () => {

    const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null); // For editing
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnnouncements = announcements.filter(ann =>
    ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAnnouncement = () => {
    setCurrentAnnouncement(null); // Clear for new announcement
    setIsModalOpen(true);
  };

  const handleEditAnnouncement = (ann) => {
    setCurrentAnnouncement(ann);
    setIsModalOpen(true);
  };

  const handleSaveAnnouncement = (annData) => {
    if (annData.id) {
      // Edit existing announcement
      setAnnouncements(announcements.map(ann => ann.id === annData.id ? annData : ann));
    } else {
      // Add new announcement
      const newId = `ann${String(announcements.length + 1).padStart(3, '0')}`; // Simple ID generation
      setAnnouncements([
        ...announcements,
        {
          ...annData,
          id: newId,
          date: new Date().toISOString().slice(0, 10), // Current date
          status: 'Active' // New announcements are active by default
        }
      ]);
    }
    setIsModalOpen(false);
    setCurrentAnnouncement(null);
    // In a real app, you'd send an API request here
    console.log('Saving announcement:', annData);
  };

  const handleDeleteAnnouncement = (annId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== annId));
      // In a real app, you'd send an API request here
      console.log(`Deleting announcement ${annId}`);
    }
  };

  const handleToggleStatus = (annId) => {
    setAnnouncements(announcements.map(ann =>
      ann.id === annId ? { ...ann, status: ann.status === 'Active' ? 'Archived' : 'Active' } : ann
    ));
    // In a real app, you'd send an API request here
    console.log(`Toggling status for announcement ${annId}`);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <PageHeader 
            icon={Bell} 
            title="Announcements" 
            subtitle="Manage system-wide announcements for users and pharmacies." 
        />

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search announcements by title or content..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleAddAnnouncement}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <PlusCircle className="mr-2" size={20} /> Add New Announcement
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((ann) => (
                <tr key={ann.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ann.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ann.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ann.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ann.expiryDate || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ann.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ann.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAnnouncement(ann)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        title="Edit Announcement"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(ann.id)}
                        className={`p-2 rounded-full transition-colors ${
                          ann.status === 'Active' ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-100' : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                        }`}
                        title={ann.status === 'Active' ? 'Archive Announcement' : 'Activate Announcement'}
                      >
                        {ann.status === 'Active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No announcements found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {currentAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const annData = {
                  id: currentAnnouncement ? currentAnnouncement.id : null,
                  title: formData.get('title'),
                  content: formData.get('content'),
                  expiryDate: formData.get('expiryDate') || null, // Allow null expiry
                };
                handleSaveAnnouncement(annData);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={currentAnnouncement?.title || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="content"
                  name="content"
                  rows="4"
                  defaultValue={currentAnnouncement?.content || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  defaultValue={currentAnnouncement?.expiryDate || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentAnnouncement ? 'Save Changes' : 'Add Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
   
  )
}

export default Announcements
