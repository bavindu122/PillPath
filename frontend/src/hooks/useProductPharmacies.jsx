import { useState, useEffect } from 'react';
import { otcService } from '../services/api/OtcService';

export const useProductPharmacies = (productName) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      if (!productName || productName === 'undefined') {
        console.error('Invalid product name:', productName);
        setError('Product name is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching pharmacies for:', productName);
        
        const data = await otcService.getPharmaciesWithProduct(productName);
        console.log('Raw pharmacy data received:', data);
        
        // Transform the nested structure from backend
        const transformedPharmacies = data.map((pharmacy, index) => {
          // Get the first product from the products array (they all have the same product)
          const product = pharmacy.products && pharmacy.products.length > 0 
            ? pharmacy.products[0] 
            : null;
          
          if (!product) {
            console.warn('No product found for pharmacy:', pharmacy);
            return null;
          }

          return {
            id: pharmacy.pharmacyId || index,
            name: pharmacy.pharmacyName || 'Unknown Pharmacy',
            address: pharmacy.address || 'Address not available',
            distance: '0 km', // You can calculate this if you have coordinates
            rating: 4.5, // You can add this to backend or calculate based on reviews
            reviews: 100, // You can add this to backend
            phone: pharmacy.phoneNumber || pharmacy.phone || 'N/A',
            email: pharmacy.email || 'N/A',
            openTime: pharmacy.openingHours || '9 AM - 9 PM', // Add this field to backend if available
            price: product.price,
            originalPrice: product.price * 1.2,
            discount: Math.round(((product.price * 1.2 - product.price) / (product.price * 1.2)) * 100),
            inStock: product.stock > 0 && product.status === 'In Stock',
            stockCount: product.stock,
            productId: product.id,
            productImageUrl: product.imageUrl,
            productDescription: product.description,
            deliveryTime: '30 mins', // You can add this to backend
            deliveryFee: 2.99, // You can add this to backend
            verified: true, // You can add this to backend
            features: [
              'Free Delivery over Rs.2500', 
              'Prescription Available', 
              'Insurance Accepted'
            ], // You can add this to backend
          };
        }).filter(pharmacy => pharmacy !== null); // Remove any null entries
        
        console.log('Transformed pharmacies:', transformedPharmacies);
        setPharmacies(transformedPharmacies);
      } catch (err) {
        console.error('Error fetching pharmacies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [productName]);

  return { pharmacies, loading, error };
};





























// import { useState, useEffect } from 'react';
// import { otcService } from '../../src/services/api/OtcService';

// export const useProductPharmacies = (productName) => {
//   const [pharmacies, setPharmacies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPharmacies = async () => {
//       if (!productName) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
//         const data = await otcService.getPharmaciesWithProduct(productName);
        
//         // Transform to match your store format
//         const transformedPharmacies = data.map((pharmacy, index) => ({
//           id: pharmacy.pharmacyId || index,
//           name: pharmacy.pharmacyName,
//           address: pharmacy.address || 'Address not available',
//           distance: '0 km', // You can calculate this if you have coordinates
//           rating: pharmacy.rating || 4.5,
//           reviews: pharmacy.reviews || 100,
//           phone: pharmacy.phone || 'N/A',
//           openTime: pharmacy.openingHours || '9 AM - 9 PM',
//           price: pharmacy.price,
//           originalPrice: pharmacy.price * 1.2,
//           discount: Math.round(((pharmacy.price * 1.2 - pharmacy.price) / (pharmacy.price * 1.2)) * 100),
//           inStock: pharmacy.stock > 0,
//           stockCount: pharmacy.stock,
//           deliveryTime: '30 mins',
//           deliveryFee: 2.99,
//           verified: true,
//           features: ['Free Delivery over $25', 'Prescription Available', 'Insurance Accepted'],
//         }));
        
//         setPharmacies(transformedPharmacies);
//       } catch (err) {
//         console.error('Error fetching pharmacies:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPharmacies();
//   }, [productName]);

//   return { pharmacies, loading, error };
// };