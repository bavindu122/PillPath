import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit3, Search, Camera, Sparkles, Users, Shield, Eye, EyeOff } from 'lucide-react';
import staffService from '../../../../services/staffService';

export default function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    profilePictureUrl: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: '',
    shiftSchedule: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TODO: Get pharmacy ID from context/auth
  const pharmacyId = 1; // This should come from the authenticated pharmacy admin's context

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const staff = await staffService.getStaffByPharmacy(pharmacyId);
      setStaffMembers(staff);
    } catch (err) {
      setError('Failed to load staff members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStaff({ ...newStaff, profilePictureUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    if (!newStaff.fullName || !newStaff.email || !newStaff.licenseNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (!editingStaffId && newStaff.password !== newStaff.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editingStaffId) {
        // Update existing staff member
        const updateData = {
          fullName: newStaff.fullName,
          email: newStaff.email,
          phoneNumber: newStaff.phoneNumber,
          profilePictureUrl: newStaff.profilePictureUrl,
          specialization: newStaff.specialization,
          yearsOfExperience: newStaff.yearsOfExperience ? parseInt(newStaff.yearsOfExperience) : null,
          shiftSchedule: newStaff.shiftSchedule,
          isActive: true
        };

        await staffService.updateStaffMember(editingStaffId, updateData);
        setEditingStaffId(null);
      } else {
        // Add new staff member
        const staffData = {
          fullName: newStaff.fullName,
          email: newStaff.email,
          password: newStaff.password,
          confirmPassword: newStaff.confirmPassword,
          phoneNumber: newStaff.phoneNumber,
          profilePictureUrl: newStaff.profilePictureUrl,
          licenseNumber: newStaff.licenseNumber,
          specialization: newStaff.specialization,
          yearsOfExperience: newStaff.yearsOfExperience ? parseInt(newStaff.yearsOfExperience) : null,
          shiftSchedule: newStaff.shiftSchedule
        };

        await staffService.addStaffMember(pharmacyId, staffData);
      }

      // Reset form and close modal
      setNewStaff({
        fullName: '',
        profilePictureUrl: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        specialization: '',
        yearsOfExperience: '',
        shiftSchedule: ''
      });
      setShowAddStaffModal(false);

      // Refresh staff list
      await fetchStaffMembers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setLoading(true);
        await staffService.deleteStaffMember(id);
        await fetchStaffMembers(); // Refresh the list
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaffId(staff.id);
    setNewStaff({
      fullName: staff.fullName || '',
      profilePictureUrl: staff.profilePictureUrl || '',
      email: staff.email || '',
      phoneNumber: staff.phoneNumber || '',
      licenseNumber: staff.licenseNumber || '',
      specialization: staff.specialization || '',
      yearsOfExperience: staff.yearsOfExperience || '',
      shiftSchedule: staff.shiftSchedule || '',
      password: '',
      confirmPassword: ''
    });
    setShowAddStaffModal(true);
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
                setNewStaff({
                  fullName: '',
                  profilePictureUrl: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                  confirmPassword: '',
                  licenseNumber: '',
                  specialization: '',
                  yearsOfExperience: '',
                  shiftSchedule: ''
                });
                setShowAddStaffModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              disabled={loading}
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Staff Grid */}
          {!loading && (
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
                        {staff.profilePictureUrl ? (
                          <img
                            src={staff.profilePictureUrl}
                            alt={`${staff.fullName}'s profile`}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow">
                            {staff.fullName.charAt(0)}
                          </div>
                        )}
                        {/* Status indicator */}
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${
                          staff.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>

                    {/* Staff Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{staff.fullName}</h3>
                      <p className="text-sm text-gray-500 mb-1">{staff.email}</p>
                      <p className="text-sm text-gray-500 mb-1">{staff.phoneNumber}</p>
                      {staff.specialization && (
                        <p className="text-sm text-blue-600 font-medium">{staff.specialization}</p>
                      )}
                      {staff.licenseNumber && (
                        <p className="text-xs text-gray-400">License: {staff.licenseNumber}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        disabled={loading}
                      >
                        <div className="flex items-center">
                          <Edit3 className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Edit</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        disabled={loading}
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
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newStaff.fullName}
                    onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    {newStaff.profilePictureUrl ? (
                      <img src={newStaff.profilePictureUrl} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                        {newStaff.fullName.charAt(0) || '?'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
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
                    value={newStaff.phoneNumber}
                    onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                  <input
                    type="text"
                    value={newStaff.licenseNumber}
                    onChange={(e) => setNewStaff({ ...newStaff, licenseNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                    disabled={editingStaffId} // Don't allow editing license number
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={newStaff.specialization}
                    onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Clinical Pharmacy, Pediatric Pharmacy"
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={newStaff.yearsOfExperience}
                    onChange={(e) => setNewStaff({ ...newStaff, yearsOfExperience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    min="0"
                  />
                </div>

                {/* Shift Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Schedule</label>
                  <input
                    type="text"
                    value={newStaff.shiftSchedule}
                    onChange={(e) => setNewStaff({ ...newStaff, shiftSchedule: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>

                {/* Password Field (only show when adding new staff) */}
                {!editingStaffId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newStaff.password}
                          onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-12"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Re-enter Password *</label>
                      <div className="relative">
                        <input
                          type={showReenterPassword ? "text" : "password"}
                          value={newStaff.confirmPassword}
                          onChange={(e) => setNewStaff({ ...newStaff, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-12"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowReenterPassword((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showReenterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    disabled={loading}
                  >
                    <div className="flex items-center">
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      <span className="font-medium">
                        {editingStaffId ? 'Update Staff' : 'Add Staff'}
                      </span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
