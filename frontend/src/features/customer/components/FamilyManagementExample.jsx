// Example of how to use the EditProfileModal for family members
// Place this in your family management component

import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';

const FamilyManagementExample = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [isEditingFamilyMember, setIsEditingFamilyMember] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    // Your family members data - make sure each member has an 'id' field
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "123-456-7890",
      // ... other family member fields
    }
  ]);

  // For editing current user profile
  const handleEditMyProfile = () => {
    setSelectedFamilyMember(null);
    setIsEditingFamilyMember(false);
    setIsEditModalOpen(true);
  };

  // For editing a specific family member
  const handleEditFamilyMember = (member) => {
    console.log('=== EDITING FAMILY MEMBER ===');
    console.log('Selected member:', member);
    
    setSelectedFamilyMember(member);
    setIsEditingFamilyMember(true);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedFamilyMember(null);
    setIsEditingFamilyMember(false);
  };

  const handleFamilyMemberUpdate = (updatedMember) => {
    console.log('=== FAMILY MEMBER UPDATED ===');
    console.log('Updated member:', updatedMember);
    
    // Update the family members list
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div>
      {/* Button to edit your own profile */}
      <button onClick={handleEditMyProfile}>
        Edit My Profile
      </button>

      {/* List of family members */}
      {familyMembers.map((member) => (
        <div key={member.id} className="family-member-card">
          <h3>{member.fullName}</h3>
          <p>{member.email}</p>
          <button onClick={() => handleEditFamilyMember(member)}>
            Edit {member.fullName}'s Profile
          </button>
        </div>
      ))}

      {/* The Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseModal}
        familyMember={isEditingFamilyMember ? selectedFamilyMember : null}
        isFamilyMember={isEditingFamilyMember}
        onFamilyMemberUpdate={isEditingFamilyMember ? handleFamilyMemberUpdate : null}
      />
    </div>
  );
};

export default FamilyManagementExample;
