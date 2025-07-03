
import React, { useState } from 'react';
import { UserPlus, Trash2, Edit3, Search } from 'lucide-react'; // Added icons

export default function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Alice Wonderland', role: 'Pharmacist', email: 'alice@pharmacare.com', phone: '111-222-3333' },
    { id: 2, name: 'Bob The Builder', role: 'Pharmacy Technician', email: 'bob@pharmacare.com', phone: '444-555-6666' },
    { id: 3, name: 'Charlie Chaplin', role: 'Administrator', email: 'charlie@pharmacare.com', phone: '777-888-9999' },
  ]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStaffId, setEditingStaffId] = useState(null); // State to track which staff member is being edited

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (editingStaffId) {
      setStaffMembers(staffMembers.map(staff => staff.id === editingStaffId ? { ...staff, ...newStaff } : staff));
      setEditingStaffId(null);
    } else {
      setStaffMembers([...staffMembers, { id: staffMembers.length + 1, ...newStaff }]);
    }
    setNewStaff({ name: '', role: '', email: '', phone: '' });
    setShowAddStaffModal(false);
  };

  const handleDeleteStaff = (id) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  const handleEditStaff = (staff) => {
    setEditingStaffId(staff.id);
    setNewStaff({ name: staff.name, role: staff.role, email: staff.email, phone: staff.phone });
    setShowAddStaffModal(true);
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Staff Management</h2>

      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditingStaffId(null);
              setNewStaff({ name: '', role: '', email: '', phone: '' });
              setShowAddStaffModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Staff
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No staff members found.</td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded-md hover:bg-blue-100 transition-colors"
                        title="Edit Staff"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors"
                        title="Delete Staff"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
            <form onSubmit={handleAddStaff}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  id="role"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {editingStaffId ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}