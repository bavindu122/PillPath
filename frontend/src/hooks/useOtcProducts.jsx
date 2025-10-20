import { useState, useEffect } from 'react';
import { otcService } from '../../src/services/api/OtcService';

export const useOtcProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await otcService.getAllProducts();
        
        // Transform backend data to match frontend structure
        const transformedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.imageUrl || null,
          rating: 4.5, // You can add rating to backend or calculate
          price: product.price,
          originalPrice: product.price * 1.3, // Calculate discount price
          category: product.category || 'General',
          stock: product.stock,
          status: product.status,
          dosage: product.dosage,
          manufacturer: product.manufacturer,
          packSize: product.packSize,
          inStock: product.stock > 0,
          discount: Math.round(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100),
          brand: product.manufacturer || 'Generic',
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error in useOtcProducts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    await fetchProducts();
  };

  return { products, loading, error, refetch };
};