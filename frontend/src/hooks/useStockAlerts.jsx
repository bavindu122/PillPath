import { useState, useEffect } from 'react';
import { getStockAlerts } from '../services/api/StockAlertsService';

const useStockAlerts = (pharmacyId) => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    if (!pharmacyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getStockAlerts(pharmacyId);
      
      // ✅ Map to match backend field names: name, stock, category
      const formattedAlerts = data.map(item => ({
        itemName: item.name,           // Backend uses "name"
        unitsLeft: item.stock,          // Backend uses "stock"
        category: item.category         // Backend uses "category"
      }));
      
      // Sort by units left (lowest first)
      formattedAlerts.sort((a, b) => a.unitsLeft - b.unitsLeft);
      
      console.log('✅ Formatted alerts:', formattedAlerts);
      setAlerts(formattedAlerts);
    } catch (err) {
      console.error('❌ Error loading stock alerts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [pharmacyId]);

  return {
    alerts,
    isLoading,
    error,
    refreshAlerts: fetchAlerts
  };
};

export default useStockAlerts;




























// import { useState, useEffect } from 'react';
// import { getStockAlerts } from '../services/api/StockAlertsService';

// const useStockAlerts = (pharmacyId) => {
//   const [alerts, setAlerts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchAlerts = async () => {
//     if (!pharmacyId) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError(null);

//       const data = await getStockAlerts(pharmacyId);
      
//       // Transform data to match your component's expected format
//       const formattedAlerts = data.map(item => ({
//         itemName: item.productName || item.itemName,
//         unitsLeft: item.stockQuantity || item.unitsLeft || 0,
//         reorderLevel: item.reorderLevel || 10,
//         category: item.category
//       }));
      
//       // Sort by units left (lowest first)
//       formattedAlerts.sort((a, b) => a.unitsLeft - b.unitsLeft);
      
//       setAlerts(formattedAlerts);
//     } catch (err) {
//       console.error('❌ Error loading stock alerts:', err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlerts();
//   }, [pharmacyId]);

//   return {
//     alerts,
//     isLoading,
//     error,
//     refreshAlerts: fetchAlerts
//   };
// };

// export default useStockAlerts;