import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit3, Search, Camera, Sparkles, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { staffService } from '../../services/staffService';
import { usePharmacyAuth } from '../../../../hooks/usePharmacyAuth';

export default function StaffManagement() {
  const { user, isAuthenticated } = usePharmacyAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    profilePictureUrl: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    position: '',
    yearsOfExperience: '',
    shiftSchedule: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get pharmacy ID from authenticated user
  const pharmacyId = user?.pharmacyId || user?.pharmacy?.id;

    useEffect(() => {
    if (isAuthenticated && pharmacyId) {
        // Debug user info
        console.log('Current user:', user);
        console.log('User roles:', user?.roles || user?.authorities);
        console.log('User pharmacy ID:', user?.pharmacyId);
        console.log('Target pharmacy ID:', pharmacyId);
        
        fetchStaffMembers();
    } else if (isAuthenticated && !pharmacyId) {
        setError('Unable to determine pharmacy ID. Please contact support.');
    }
    }, [isAuthenticated, pharmacyId]);

  const fetchStaffMembers = async () => {
    if (!pharmacyId) {
      setError('Pharmacy ID not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Fetching staff for pharmacy ID: ${pharmacyId}`);
      
      // Check if we have a valid auth token
      const token = localStorage.getItem('auth_token');
      console.log('Auth token exists:', !!token);
      console.log('Auth token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'None');
      
      // Debug: Check if user pharmacy matches requested pharmacy
      console.log('User pharmacy ID:', user?.pharmacyId);
      console.log('Requested pharmacy ID:', pharmacyId);
      console.log('User details:', {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        userType: user?.userType
      });
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const staff = await staffService.getPharmacyStaff(pharmacyId);
      setStaffMembers(staff || []);
    } catch (err) {
      console.error('Failed to fetch staff members:', err);
      
      if (err.message.includes('403')) {
        setError('Access denied. Please check your permissions and try logging in again.');
        console.error('403 Error Details:', {
          userRole: user?.role,
          userType: user?.userType,
          pharmacyId: pharmacyId,
          token: !!localStorage.getItem('auth_token')
        });
      } else if (err.message.includes('401')) {
        setError('Authentication expired. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } else {
        setError(err.message || 'Failed to load staff members');
      }
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

    if (!pharmacyId) {
      setError('Pharmacy ID not found. Please log in again.');
      return;
    }

    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email || !newStaff.licenseNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (!editingStaffId && newStaff.password !== newStaff.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!editingStaffId && newStaff.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editingStaffId) {
        // Update existing staff member
        const updateData = {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          email: newStaff.email,
          phoneNumber: newStaff.phoneNumber,
          position: newStaff.position,
          licenseNumber: newStaff.licenseNumber,
        };

        await staffService.updateStaffMember(editingStaffId, updateData);
        setEditingStaffId(null);
      } else {
        // Add new staff member - match backend PharmacistCreateRequest DTO
        const staffData = {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          email: newStaff.email,
          password: newStaff.password,
          phoneNumber: newStaff.phoneNumber,
          position: newStaff.position || 'PHARMACIST',
          licenseNumber: newStaff.licenseNumber,
          pharmacyId: parseInt(pharmacyId)
        };

        await staffService.addStaffMember(pharmacyId, staffData);
      }

      // Reset form and close modal
      setNewStaff({
        firstName: '',
        lastName: '',
        profilePictureUrl: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        position: '',
        yearsOfExperience: '',
        shiftSchedule: ''
      });
      setShowAddStaffModal(false);

      // Refresh staff list
      await fetchStaffMembers();
    } catch (err) {
      console.error('Failed to add/update staff member:', err);
      
      if (err.response?.status === 403) {
        setError('Access denied. You may not have permission to manage staff for this pharmacy.');
      } else if (err.response?.status === 401) {
        setError('Authentication expired. Please log in again.');
      } else {
        setError(err.message || 'Failed to save staff member');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        setLoading(true);
        setError('');
        await staffService.deleteStaffMember(id);
        await fetchStaffMembers(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete staff member:', err);
        
        if (err.response?.status === 403) {
          setError('Access denied. You may not have permission to delete staff members.');
        } else if (err.response?.status === 401) {
          setError('Authentication expired. Please log in again.');
        } else {
          setError(err.message || 'Failed to delete staff member');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaffId(staff.id);
    setNewStaff({
      firstName: staff.firstName || '',
      lastName: staff.lastName || '',
      profilePictureUrl: staff.profilePictureUrl || '',
      email: staff.email || '',
      phoneNumber: staff.phoneNumber || '',
      licenseNumber: staff.licenseNumber || '',
      position: staff.position || '',
      yearsOfExperience: staff.yearsOfExperience || '',
      shiftSchedule: staff.shiftSchedule || '',
      password: '',
      confirmPassword: ''
    });
    setShowAddStaffModal(true);
  };

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName || ''} ${staff.lastName || ''}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || 
           (staff.email && staff.email.toLowerCase().includes(searchLower));
  });

  // Show authentication error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <Shield className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in as a pharmacy administrator to access staff management.</p>
          <button 
            onClick={() => window.location.href = '/pharmacy-admin/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show pharmacy ID error if authenticated but no pharmacy ID
  if (isAuthenticated && !pharmacyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-yellow-600 mb-4">
            <Users className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pharmacy Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to determine your pharmacy. Please contact support or log in again.</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/pharmacy-admin/login'}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Log In Again
            </button>
            <p className="text-sm text-gray-500">User: {user?.email || 'Unknown'}</p>
          </div>
        </div>
      </div>
    );
  }

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
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Pharmacy: {user.pharmacyName || `ID: ${pharmacyId}`} | Admin: {user.firstName} {user.lastName}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              {error}
            </div>
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
                  firstName: '',
                  lastName: '',
                  profilePictureUrl: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                  confirmPassword: '',
                  licenseNumber: '',
                  position: '',
                  yearsOfExperience: '',
                  shiftSchedule: ''
                });
                setShowAddStaffModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              disabled={loading || !pharmacyId}
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
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search criteria.' 
                      : 'Add your first staff member to get started.'
                    }
                  </p>
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
                            alt={`${staff.firstName} ${staff.lastName}'s profile`}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow">
                            {staff.firstName?.charAt(0) || '?'}{staff.lastName?.charAt(0) || '?'}
                          </div>
                        )}
                        {/* Status indicator */}
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${
                          staff.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>

                    {/* Staff Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {staff.firstName || 'N/A'} {staff.lastName || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">{staff.email || 'No email'}</p>
                      <p className="text-sm text-gray-500 mb-1">{staff.phoneNumber || 'No phone'}</p>
                      {staff.position && (
                        <p className="text-sm text-blue-600 font-medium">{staff.position}</p>
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
                {/* First Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
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
                        {newStaff.firstName.charAt(0)}{newStaff.lastName.charAt(0) || '?'}
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

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select Position</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="PHARMACY_TECHNICIAN">Pharmacy Technician</option>
                    <option value="PHARMACY_ASSISTANT">Pharmacy Assistant</option>
                  </select>
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
                          minLength={6}
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