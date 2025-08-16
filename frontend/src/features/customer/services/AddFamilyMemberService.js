export const addFamilyMember = async (memberData) => {
  try {
    console.log('Sending member data:', memberData);
    
    // Get token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Call the correct backend endpoint
    const response = await fetch('http://localhost:8080/api/members/family-members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);
    return result;
  } catch (error) {
    console.error('Add family member failed:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};
