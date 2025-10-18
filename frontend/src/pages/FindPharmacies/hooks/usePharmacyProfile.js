import { useState, useEffect } from 'react';

export const usePharmacyProfile = (pharmacyId) => {
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [otcProducts, setOtcProducts] = useState([]);

  useEffect(() => {
    const fetchPharmacyProfile = async () => {
      if (!pharmacyId) {
        setError("Pharmacy ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Use environment variable or fallback to localhost
        const baseUrl =
  typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL
    : "http://localhost:8080";
        
        console.log(`Fetching pharmacy profile for ID: ${pharmacyId}`);
        
        // Fetch pharmacy profile
        const profileResponse = await fetch(`${baseUrl}/api/v1/pharmacies/${pharmacyId}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        console.log('Profile response status:', profileResponse.status);
        console.log('Profile response headers:', profileResponse.headers.get('content-type'));

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('Profile response error:', errorText);
          
          if (profileResponse.status === 404) {
            throw new Error("Pharmacy not found");
          }
          throw new Error(`Failed to fetch pharmacy profile: ${profileResponse.status} - ${errorText}`);
        }

        const contentType = profileResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await profileResponse.text();
          console.error('Expected JSON but received:', responseText);
          throw new Error('Server returned non-JSON response');
        }

        const profileData = await profileResponse.json();
        console.log('Profile data received:', profileData);

        // Fetch pharmacy products
        const productsResponse = await fetch(`${baseUrl}/api/v1/pharmacies/${pharmacyId}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        let productsData = [];
        
        if (productsResponse.ok) {
          const productsContentType = productsResponse.headers.get('content-type');
          if (productsContentType && productsContentType.includes('application/json')) {
            productsData = await productsResponse.json();
          }
        } else {
          console.warn('Failed to fetch products:', productsResponse.status);
        }

        // Transform the data to match the expected format
        const transformedPharmacy = {
          id: profileData.id,
          name: profileData.name,
          address: profileData.address,
          lat: profileData.latitude,
          lng: profileData.longitude,
          phone: profileData.phoneNumber,
          email: profileData.email,
          rating: profileData.averageRating || 0,
          totalReviews: profileData.totalReviews || 0,
          
          // Logo and Banner URLs from database
          logo: profileData.logoUrl,
          logoUrl: profileData.logoUrl,
          bannerUrl: profileData.bannerUrl,
          logoPublicId: profileData.logoPublicId,
          bannerPublicId: profileData.bannerPublicId,
          
          // Ensure operatingHours is always an object, never null
          operatingHours: profileData.operatingHours || {},
          // Ensure services is always an array, never null
          services: Array.isArray(profileData.services) ? profileData.services : [],
          isVerified: profileData.isVerified,
          isActive: profileData.isActive,
          hasDelivery: profileData.hasDelivery,
          deliveryAvailable: profileData.deliveryAvailable,
          deliveryRadius: profileData.deliveryRadius,
          has24HourService: profileData.has24HourService,
          acceptsInsurance: profileData.acceptsInsurance,
          hasVaccinations: profileData.hasVaccinations,
          currentStatus: profileData.currentStatus,
          status: profileData.status,
          licenseNumber: profileData.licenseNumber,
          licenseExpiryDate: profileData.licenseExpiryDate,
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt
        };

        setPharmacy(transformedPharmacy);
        setReviews(profileData.recentReviews || []);
        setOtcProducts(productsData);

      } catch (err) {
        console.error("Error fetching pharmacy profile:", err);
        setError(err.message || "Failed to load pharmacy profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyProfile();
  }, [pharmacyId]);

  return {
    pharmacy,
    loading,
    error,
    reviews,
    otcProducts
  };
};