import { useState, useEffect } from 'react';
import { Gift, TrendingUp, Info, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoyaltyRewardsCard = () => {
  const navigate = useNavigate();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculatedPoints, setCalculatedPoints] = useState(0);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:8080/api/v1/customer/loyalty', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Please log in again.');
        }
        // Try to get error details from response
        let errorMessage = `Failed to fetch loyalty data: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If can't parse JSON, use status text
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Loyalty data received:', data);
      setLoyaltyData(data);
      
      // Fetch transaction history to calculate actual points
      const transactionsResponse = await fetch('http://localhost:8080/api/v1/customer/loyalty/transactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (transactionsResponse.ok) {
        const transactions = await transactionsResponse.json();
        // Calculate total points from all transactions (excluding cancelled orders)
        const totalPoints = transactions
          .filter(txn => txn.orderStatus !== 'CANCELLED')
          .reduce((sum, txn) => sum + (txn.pointsEarned || 0), 0);
        setCalculatedPoints(totalPoints);
      } else {
        // Fallback to backend's currentPoints if transactions endpoint fails
        setCalculatedPoints(data.currentPoints || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching loyalty data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-blue-600/20 p-2 rounded-lg">
            <Gift className="h-6 w-6 text-blue-200" />
          </span>
          <h2 className="text-white font-semibold">Loyalty & Rewards</h2>
        </div>
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
          <p className="text-red-200 text-sm font-medium">Unable to load loyalty data</p>
          <p className="text-red-300/80 text-xs mt-1">{error}</p>
          <button
            onClick={fetchLoyaltyData}
            className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentPoints = calculatedPoints;
  const pointsRate = loyaltyData?.pointsRate || 1.0;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600/20 p-2 rounded-lg">
            <Gift size={18} className="text-blue-200" />
          </span>
          <h3 className="text-white font-semibold">Loyalty & Rewards</h3>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Your Points Balance</p>
            <p className="text-3xl font-bold text-white">{currentPoints.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 rounded-full h-12 w-12 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 mb-3">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-blue-300 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-white font-medium text-sm mb-2">How to Earn Points</h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-300 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Earn <strong className="text-white/80">{pointsRate}</strong> point{pointsRate !== 1 ? 's' : ''} for every LKR 1 spent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-300 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Points awarded only on <strong className="text-white/80">card payments</strong> (credit/debit)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-300 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Points credited automatically when payment is confirmed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {currentPoints > 0 && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3 mb-3">
          <p className="text-xs text-green-200">
            🎉 You have <strong>{currentPoints}</strong> points ready to use!
          </p>
        </div>
      )}

      <button 
        onClick={() => navigate('/customer/loyalty-history')}
        className="w-full py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center gap-2"
      >
        <History size={14} />
        View Loyalty History
      </button>
    </div>
  );
};

export default LoyaltyRewardsCard;
