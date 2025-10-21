import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, CreditCard, Calendar, TrendingUp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrdersService from '../../../services/api/OrdersService';

export default function LoyaltyHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Fetch loyalty data
      const loyaltyResponse = await fetch('http://localhost:8080/api/v1/customer/loyalty', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (loyaltyResponse.ok) {
        const data = await loyaltyResponse.json();
        setLoyaltyData(data);
      }

      // Fetch card payment transactions directly from backend
      const transactionsResponse = await fetch('http://localhost:8080/api/v1/customer/loyalty/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (transactionsResponse.ok) {
        const transactions = await transactionsResponse.json();
        // Map backend transactions to match expected format
        // Filter out cancelled orders
        const mappedOrders = transactions
          .filter(txn => txn.orderStatus !== 'CANCELLED')
          .map(txn => ({
            orderCode: txn.orderCode,
            createdAt: txn.orderDate,
            paymentMethod: txn.paymentMethod,
            totals: {
              total: txn.orderTotal
            },
            total: txn.orderTotal,
            status: txn.orderStatus,
            pointsEarned: txn.pointsEarned // Backend already calculated this
          }));
        setOrders(mappedOrders);
        
        // Calculate total points from transaction history (excluding cancelled)
        const totalPoints = mappedOrders.reduce((sum, order) => sum + (order.pointsEarned || 0), 0);
        setLoyaltyData(prev => ({
          ...prev,
          currentPoints: totalPoints
        }));
      } else {
        console.warn('Failed to load transactions:', transactionsResponse.status);
        // Fallback to old method if new endpoint fails
        const ordersData = await OrdersService.listMyOrders(true);
        const ordersList = Array.isArray(ordersData?.items) ? ordersData.items : 
                          Array.isArray(ordersData) ? ordersData : [];
        
        const cardOrders = ordersList
          .filter(order => 
            (order.paymentMethod === 'CREDIT_CARD' || 
            order.paymentMethod === 'DEBIT_CARD') &&
            order.status !== 'CANCELLED'
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setOrders(cardOrders);
        
        // Calculate total points from transaction history (fallback method, excluding cancelled)
        const rate = loyaltyData?.pointsRate || 1.0;
        const totalPoints = cardOrders.reduce((sum, order) => {
          const orderTotal = order.totals?.total || order.total || 0;
          return sum + Math.floor(orderTotal * rate);
        }, 0);
        setLoyaltyData(prev => ({
          ...prev,
          currentPoints: totalPoints
        }));
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching loyalty history:', err);
      setError(err.message || 'Failed to load loyalty history');
    } finally {
      setLoading(false);
    }
  };

  const calculatePointsEarned = (order) => {
    // If backend already calculated points, use that
    if (order.pointsEarned !== undefined) {
      return order.pointsEarned;
    }
    // Otherwise calculate from order total
    const orderTotal = order.totals?.total || order.total || 0;
    const rate = loyaltyData?.pointsRate || 1.0;
    return Math.floor(orderTotal * rate);
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-center gap-x-40">
          <button
            onClick={() => navigate('/customer/')}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gift className="h-8 w-8 text-yellow-400" />
            Loyalty Points History
          </h1>
          <div />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Balance Card */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm uppercase tracking-wider mb-1">
                    Current Balance
                  </p>
                  <p className="text-5xl font-bold">
                    {(loyaltyData?.currentPoints || 0).toLocaleString()}
                  </p>
                  <p className="text-white/80 text-sm mt-2">Points Available</p>
                </div>
                <div className="p-4 bg-white/20 rounded-full">
                  <TrendingUp className="h-10 w-10" />
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-semibold">Earning Rate</span>
                </div>
                <p className="text-sm text-white/90">
                  Earn {loyaltyData?.pointsRate || 1.0} point{(loyaltyData?.pointsRate || 1.0) !== 1 ? 's' : ''} for every LKR 1 spent on card payments
                </p>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Transaction History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <Gift className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p className="text-lg">No loyalty points earned yet</p>
                  <p className="text-sm mt-2">Make card payments to start earning points!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderTotal = order.totals?.total || order.total || 0;
                    const pointsEarned = calculatePointsEarned(order);
                    const orderDate = order.createdAt ? new Date(order.createdAt) : null;

                    return (
                      <motion.div
                        key={order.orderCode || order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => navigate(`/customer/orders/${order.orderCode}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-green-500/20 rounded-lg">
                                <CreditCard className="h-5 w-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">
                                  Order #{order.orderCode}
                                </p>
                                <p className="text-white/60 text-sm">
                                  {order.paymentMethod?.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="ml-14 space-y-1">
                              <div className="flex items-center gap-2 text-white/70 text-sm">
                                <Calendar className="h-4 w-4" />
                                {orderDate ? orderDate.toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Date unavailable'}
                              </div>
                              <div className="text-white/70 text-sm">
                                Order Total: LKR {orderTotal.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-green-400 font-bold text-xl">
                              +{pointsEarned.toLocaleString()}
                            </div>
                            <div className="text-white/60 text-sm">points earned</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-blue-100 text-sm">
                  <p className="font-semibold mb-1">About Loyalty Points</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Points are earned only on card payments (Credit/Debit)</li>
                    <li>Cash payments do not earn loyalty points</li>
                    <li>Points are credited automatically when your order is confirmed</li>
                    <li>Click on any transaction to view full order details</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
