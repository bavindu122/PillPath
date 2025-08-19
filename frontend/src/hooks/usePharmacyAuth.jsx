import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./useAuth";

const PharmacyAuthContext = createContext();

export const usePharmacyAuth = () => {
  const context = useContext(PharmacyAuthContext);
  if (!context) {
    // If no pharmacy context, fall back to main auth
    return useAuth();
  }
  return context;
};

export const PharmacyAuthProvider = ({ children }) => {
  const { 
    user, 
    token, 
    userType, 
    loading, 
    error, 
    logout: mainLogout,
    isAuthenticated 
  } = useAuth();

  const [pharmacyData, setPharmacyData] = useState(null);

  // Extract pharmacy-specific data from user profile
  useEffect(() => {
    if (user && (userType === 'pharmacy-admin' || userType === 'pharmacist')) {
      const extractedData = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        profilePictureUrl: user.profilePictureUrl,
        pharmacyId: user.pharmacyId,
        pharmacyName: user.pharmacyName,
        position: user.position,
        licenseNumber: user.licenseNumber,
        isPrimaryAdmin: user.isPrimaryAdmin,
        permissions: user.permissions || [],
        hireDate: user.hireDate
      };
      setPharmacyData(extractedData);
    } else {
      setPharmacyData(null);
    }
  }, [user, userType]);

  const logout = async () => {
    setPharmacyData(null);
    await mainLogout();
  };

  const isPharmacyAdmin = userType === 'pharmacy-admin';
  const isPharmacist = userType === 'pharmacist';
  const hasFullAccess = pharmacyData?.permissions?.includes('FULL_ACCESS');

  const value = {
    user: pharmacyData,
    token,
    userType,
    loading,
    error,
    logout,
    isAuthenticated: isAuthenticated && (isPharmacyAdmin || isPharmacist),
    isPharmacyAdmin,
    isPharmacist,
    hasFullAccess,
    pharmacyName: pharmacyData?.pharmacyName,
    position: pharmacyData?.position,
    isPrimaryAdmin: pharmacyData?.isPrimaryAdmin
  };

  return (
    <PharmacyAuthContext.Provider value={value}>
      {children}
    </PharmacyAuthContext.Provider>
  );
};