import React from 'react';
import { CreditCard, Trash2, Clock } from 'lucide-react';

const SavedCards = ({ cards, onDelete, onSelect, selectedCardId }) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Saved Cards</h3>
          <p className="text-gray-500">When you save a card during checkout, it will appear here for future use.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never used';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCardTypeIcon = (cardType) => {
    switch (cardType) {
      case 'visa':
        return <span className="text-blue-600 font-bold text-lg">VISA</span>;
      case 'mastercard':
        return <span className="text-red-600 font-bold text-lg">MC</span>;
      case 'amex':
        return <span className="text-blue-800 font-bold text-lg">AMEX</span>;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Saved Cards</h3>
      
      <div className="space-y-4">
        {cards.map(card => (
          <div
            key={card.id}
            className={`border ${selectedCardId === card.id ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-200'} rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center" onClick={() => onSelect(card)} style={{ cursor: 'pointer' }}>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  {getCardTypeIcon(card.cardType)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {card.cardNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {card.cardholderName} • Expires {card.expiryDate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Last used: {formatDate(card.lastUsed)}</span>
                </div>
                
                <button
                  onClick={() => onDelete(card.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCards;