import { useState, useEffect, useCallback } from 'react';
import PharmacyService from '../services/api/PharmacyService';

export const usePharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [stats, setStats] = useState({
    activePharmacies: 0,
    rejectedPharmacies: 0,
    pendingApproval: 0,
    suspendedPharmacies: 0,
  });
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // Track loading for individual actions
  const [bulkLoading, setBulkLoading] = useState(false); // Track bulk operations
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState([]); // For bulk operations
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // ✅ Fetch pharmacy statistics
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const statsData = await PharmacyService.getPharmacyStats();
      console.log('Pharmacy stats:', statsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch pharmacy stats:', error);
      setError(error.message);
    }
  }, []);

  // ✅ Fetch pharmacies with filters and pagination
  const fetchPharmacies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PharmacyService.getAllPharmacies(params);
      console.log('Pharmacies response:', response);
      
      // Handle paginated response
      if (response.content) {
        setPharmacies(response.content);
        setPagination({
          page: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          hasNext: !response.last,
          hasPrevious: !response.first,
        });
      } else {
        // Handle non-paginated response
        setPharmacies(Array.isArray(response) ? response : []);
      }
    } catch (error) {
      console.error('Failed to fetch pharmacies:', error);
      setError(error.message);
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch recent activities
  const fetchRecentActivities = useCallback(async (limit = 10) => {
    try {
      setError(null);
      const activities = await PharmacyService.getRecentActivities(limit);
      setRecentActivities(activities);
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      setError(error.message);
    }
  }, []);

  // ✅ Get pharmacy details
  const getPharmacyDetails = useCallback(async (pharmacyId) => {
    try {
      setError(null);
      const pharmacy = await PharmacyService.getPharmacyById(pharmacyId);
      console.log('Pharmacy details:', pharmacy);
      return pharmacy;
    } catch (error) {
      console.error('Failed to fetch pharmacy details:', error);
      setError(error.message);
      throw error;
    }
  }, []);

  // ✅ Generic action handler with optimistic updates
  const handlePharmacyAction = useCallback(async (pharmacyId, action, reason = null) => {
    const actionKey = `${pharmacyId}-${action}`;
    
    try {
      setActionLoading(prev => ({ ...prev, [actionKey]: true }));
      setError(null);
      
      // Call the appropriate service method
      let result;
      switch (action) {
        case 'approve':
          result = await PharmacyService.approvePharmacy(pharmacyId);
          break;
        case 'reject':
          result = await PharmacyService.rejectPharmacy(pharmacyId, reason);
          break;
        case 'suspend':
          result = await PharmacyService.suspendPharmacy(pharmacyId, reason);
          break;
        case 'activate':
          result = await PharmacyService.activatePharmacy(pharmacyId);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
      // Optimistic update of local state
      setPharmacies(prev => prev.map(p => {
        if (p.id === pharmacyId) {
          const updates = { ...p };
          
          switch (action) {
            case 'approve':
              updates.status = 'Active';
              updates.isActive = true;
              updates.isVerified = true;
              updates.rejectReason = null;
              break;
            case 'reject':
              updates.status = 'Rejected';
              updates.isActive = false;
              updates.isVerified = false;
              updates.rejectReason = reason;
              updates.suspendReason = null;
              break;
            case 'suspend':
              updates.status = 'Suspended';
              updates.isActive = false;
              updates.suspendReason = reason;
              break;
            case 'activate':
              updates.status = 'Active';
              updates.isActive = true;
              updates.suspendReason = null;
              break;
          }
          
          return updates;
        }
        return p;
      }));
      
      // Refresh stats after action
      await fetchStats();
      
      return result;
    } catch (error) {
      console.error(`Failed to ${action} pharmacy:`, error);
      setError(error.message);
      throw error;
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  }, [fetchStats]);

  // ✅ Individual action methods
  const approvePharmacy = useCallback(async (pharmacyId) => {
    return handlePharmacyAction(pharmacyId, 'approve');
  }, [handlePharmacyAction]);

  const rejectPharmacy = useCallback(async (pharmacyId, reason) => {
    return handlePharmacyAction(pharmacyId, 'reject', reason);
  }, [handlePharmacyAction]);

  const suspendPharmacy = useCallback(async (pharmacyId, reason) => {
    return handlePharmacyAction(pharmacyId, 'suspend', reason);
  }, [handlePharmacyAction]);

  const activatePharmacy = useCallback(async (pharmacyId) => {
    return handlePharmacyAction(pharmacyId, 'activate');
  }, [handlePharmacyAction]);

  // ✅ Bulk operation methods
  const bulkApprovePharmacies = useCallback(async (pharmacyIds) => {
    try {
      setBulkLoading(true);
      setError(null);
      
      const result = await PharmacyService.bulkApprovePharmacies(pharmacyIds);
      
      // Update local state
      setPharmacies(prev => prev.map(p => 
        pharmacyIds.includes(p.id) 
          ? { ...p, status: 'Active', isActive: true, isVerified: true, rejectReason: null }
          : p
      ));
      
      await fetchStats();
      setSelectedPharmacies([]);
      
      return result;
    } catch (error) {
      console.error('Failed to bulk approve pharmacies:', error);
      setError(error.message);
      throw error;
    } finally {
      setBulkLoading(false);
    }
  }, [fetchStats]);

  const bulkRejectPharmacies = useCallback(async (pharmacyIds, reason) => {
    try {
      setBulkLoading(true);
      setError(null);
      
      const result = await PharmacyService.bulkRejectPharmacies(pharmacyIds, reason);
      
      // Update local state
      setPharmacies(prev => prev.map(p => 
        pharmacyIds.includes(p.id) 
          ? { ...p, status: 'Rejected', isActive: false, isVerified: false, rejectReason: reason }
          : p
      ));
      
      await fetchStats();
      setSelectedPharmacies([]);
      
      return result;
    } catch (error) {
      console.error('Failed to bulk reject pharmacies:', error);
      setError(error.message);
      throw error;
    } finally {
      setBulkLoading(false);
    }
  }, [fetchStats]);

  const bulkSuspendPharmacies = useCallback(async (pharmacyIds, reason) => {
    try {
      setBulkLoading(true);
      setError(null);
      
      const result = await PharmacyService.bulkSuspendPharmacies(pharmacyIds, reason);
      
      // Update local state
      setPharmacies(prev => prev.map(p => 
        pharmacyIds.includes(p.id) 
          ? { ...p, status: 'Suspended', isActive: false, suspendReason: reason }
          : p
      ));
      
      await fetchStats();
      setSelectedPharmacies([]);
      
      return result;
    } catch (error) {
      console.error('Failed to bulk suspend pharmacies:', error);
      setError(error.message);
      throw error;
    } finally {
      setBulkLoading(false);
    }
  }, [fetchStats]);

  const bulkActivatePharmacies = useCallback(async (pharmacyIds) => {
    try {
      setBulkLoading(true);
      setError(null);
      
      const result = await PharmacyService.bulkActivatePharmacies(pharmacyIds);
      
      // Update local state
      setPharmacies(prev => prev.map(p => 
        pharmacyIds.includes(p.id) 
          ? { ...p, status: 'Active', isActive: true, suspendReason: null }
          : p
      ));
      
      await fetchStats();
      setSelectedPharmacies([]);
      
      return result;
    } catch (error) {
      console.error('Failed to bulk activate pharmacies:', error);
      setError(error.message);
      throw error;
    } finally {
      setBulkLoading(false);
    }
  }, [fetchStats]);

  // ✅ Generic management method using PharmacyManagementDTO
  const managePharmacy = useCallback(async (pharmacyId, action, reason = null) => {
    try {
      setError(null);
      const result = await PharmacyService.managePharmacy(pharmacyId, action, reason);
      
      // Refresh data after management action
      await Promise.all([
        fetchStats(),
        fetchPharmacies({ page: 0 })
      ]);
      
      return result;
    } catch (error) {
      console.error('Failed to manage pharmacy:', error);
      setError(error.message);
      throw error;
    }
  }, [fetchStats, fetchPharmacies]);

  // ✅ Selection management for bulk operations
  const togglePharmacySelection = useCallback((pharmacyId) => {
    setSelectedPharmacies(prev => 
      prev.includes(pharmacyId) 
        ? prev.filter(id => id !== pharmacyId)
        : [...prev, pharmacyId]
    );
  }, []);

  const selectAllPharmacies = useCallback(() => {
    setSelectedPharmacies(pharmacies.map(p => p.id));
  }, [pharmacies]);

  const clearSelection = useCallback(() => {
    setSelectedPharmacies([]);
  }, []);

  // ✅ Check if specific action is loading
  const isActionLoading = useCallback((pharmacyId, action) => {
    const actionKey = `${pharmacyId}-${action}`;
    return actionLoading[actionKey] || false;
  }, [actionLoading]);

  return {
    // State
    pharmacies,
    stats,
    loading,
    error,
    pagination,
    actionLoading,
    bulkLoading,
    recentActivities,
    selectedPharmacies,

    // Fetch methods
    fetchPharmacies,
    fetchStats,
    fetchRecentActivities,
    getPharmacyDetails,

    // Individual action methods
    approvePharmacy,
    rejectPharmacy,
    suspendPharmacy,
    activatePharmacy,

    // Bulk operation methods
    bulkApprovePharmacies,
    bulkRejectPharmacies,
    bulkSuspendPharmacies,
    bulkActivatePharmacies,

    // Generic methods
    handlePharmacyAction,
    managePharmacy,

    // Selection management
    togglePharmacySelection,
    selectAllPharmacies,
    clearSelection,

    // Utility methods
    isActionLoading,
  };
};

export default usePharmacies;