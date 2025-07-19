import React, { useState } from 'react';
import { UserPlus, Trash2, Edit3, Search, Camera, Sparkles, Users, Shield } from 'lucide-react';
import profilepic1 from '../../../../assets/profile_pic.png'
import profilepic2 from '../../../../assets/profile_pic.png'
import profilepic3 from '../../../../assets/pharmacist.png'

export default function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Alice Wonderland', profilePicture: profilepic1, email: 'alice@pharmacare.com', phone: '111-222-3333' },
    { id: 2, name: 'Bob The Builder', profilePicture: profilepic2, email: 'bob@pharmacare.com', phone: '444-555-6666' },
    { id: 3, name: 'Charlie Chaplin', profilePicture: profilepic3, email: 'charlie@pharmacare.com', phone: '777-888-9999' },
  ]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', profilePicture: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStaffId, setEditingStaffId] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStaff({ ...newStaff, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (editingStaffId) {
      setStaffMembers(staffMembers.map(staff => staff.id === editingStaffId ? { ...staff, ...newStaff } : staff));
      setEditingStaffId(null);
    } else {
      setStaffMembers([...staffMembers, { id: Date.now(), ...newStaff }]);
    }
    setNewStaff({ name: '', profilePicture: '', email: '', phone: '' });
    setShowAddStaffModal(false);
  };

  const handleDeleteStaff = (id) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  const handleEditStaff = (staff) => {
    setEditingStaffId(staff.id);
    setNewStaff({ name: staff.name, profilePicture: staff.profilePicture, email: staff.email, phone: staff.phone });
    setShowAddStaffModal(true);
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-md">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600">Manage your pharmacy team and staff members</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Team Members: {staffMembers.length}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setEditingStaffId(null);
                setNewStaff({ name: '', profilePicture: '', email: '', phone: '' });
                setShowAddStaffModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                <span className="font-medium">Add Staff Member</span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search staff members by name or email..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Staff Members Found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or add a new staff member.</p>
              </div>
            ) : (
              filteredStaff.map((staff) => (
                <div key={staff.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Profile Picture */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      {staff.profilePicture ? (
                        <img 
                          src={staff.profilePicture} 
                          alt={`${staff.name}'s profile`} 
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow">
                          {staff.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Staff Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{staff.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{staff.email}</p>
                    <p className="text-sm text-gray-500">{staff.phone}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleEditStaff(staff)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <Edit3 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Edit</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Delete</span>
                      </div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    {newStaff.profilePicture ? (
                      <img src={newStaff.profilePicture} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                        {newStaff.name.charAt(0) || '?'}
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Upload Image</span>
                      </div>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddStaff}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {editingStaffId ? 'Update Staff' : 'Add Staff'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
