import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePaymentGateway from '../../hooks/usePaymentGateway';
import PaymentGatewayHeader from '../../components/PaymentGateway/PaymentGatewayHeader';
import PaymentForm from '../../components/PaymentGateway/PaymentForm';
import SavedCards from '../../components/PaymentGateway/SavedCards';
import TransactionHistory from '../../components/PaymentGateway/TransactionHistory';
import PaymentStatusModal from '../../components/PaymentGateway/PaymentStatusModal';
import AddFundsModal from '../../components/PaymentGateway/AddFundsModal';

const PaymentGatewayPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('payment'); // 'payment', 'cards', 'history'
  const [selectedCard, setSelectedCard] = useState(null);
  
  const {
    balance,
    transactions,
    savedCards,
    isLoading,
    paymentStatus,
    processingPayment,
    processPayment,
    addFunds,
    saveCard,
    deleteCard,
    resetPaymentStatus
  } = usePaymentGateway();
  
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);
  
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setActiveTab('payment');
  };
  
  const handleCardDelete = (cardId) => {
    deleteCard(cardId);
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(null);
    }
  };
  
  const handleSaveCard = (cardData) => {
    const success = saveCard(cardData);
    return success;
  };
  
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/pharmacy-admin/dashboard')}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
          <p className="text-gray-500 mt-1">Manage your pharmacy's financial transactions</p>
        </div>
      </div>
      
      <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <PaymentGatewayHeader 
          balance={balance} 
          onAddFunds={() => setShowAddFundsModal(true)} 
        />
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <button
              onClick={() => setActiveTab('payment')}
              className={`py-4 text-sm font-medium transition-colors ${
                activeTab === 'payment' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Make a Payment
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`py-4 text-sm font-medium transition-colors ${
                activeTab === 'cards' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Saved Cards ({savedCards.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 text-sm font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Transaction History
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'payment' && (
            <PaymentForm 
              processPayment={processPayment} 
              isProcessing={processingPayment}
              balance={balance}
              savedCards={savedCards}
              onSaveCard={handleSaveCard}
              selectedCard={selectedCard}
              onSelectCard={setSelectedCard}
            />
          )}
          
          {activeTab === 'cards' && (
            <SavedCards 
              cards={savedCards}
              onDelete={handleCardDelete}
              onSelect={handleCardSelect}
              selectedCardId={selectedCard?.id}
            />
          )}
          
          {activeTab === 'history' && (
            <TransactionHistory 
              transactions={transactions} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
      
      {/* Modals */}
      <PaymentStatusModal 
        status={paymentStatus} 
        onClose={resetPaymentStatus} 
      />
      
      <AddFundsModal 
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        onAddFunds={addFunds}
      />
    </div>
  );
};

export default PaymentGatewayPage;























// import React, { useState, useEffect } from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import usePaymentGateway from '../../hooks/usePaymentGateway';
// import PaymentGatewayHeader from '../../components/PaymentGateway/PaymentGatewayHeader';
// import PaymentForm from '../../components/PaymentGateway/PaymentForm';
// // import TransactionHistory from '../../components/PaymentGateway/TransactionHistory';
// import PaymentStatusModal from '../../components/PaymentGateway/PaymentStatusModal';
// // import AddFundsModal from '../../components/PaymentGateway/AddFundsModal';

// const PaymentGatewayPage = () => {
//   const navigate = useNavigate();
//   const [fadeIn, setFadeIn] = useState(false);
//   const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  
//   const {
//     balance,
//     transactions,
//     isLoading,
//     paymentStatus,
//     processingPayment,
//     processPayment,
//     addFunds,
//     resetPaymentStatus
//   } = usePaymentGateway();
  
//   useEffect(() => {
//     setTimeout(() => setFadeIn(true), 100);
//   }, []);
  
//   return (
//     <div className="p-6">
//       <div className="mb-6 flex items-center">
//         <button
//           onClick={() => navigate('/pharmacy-admin/dashboard')}
//           className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Payment Gateway</h1>
//           <p className="text-gray-500 mt-1">Manage your pharmacy's financial transactions</p>
//         </div>
//       </div>
      
//       <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
//         <PaymentGatewayHeader 
//           balance={balance} 
//           onAddFunds={() => setShowAddFundsModal(true)} 
//         />
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           <div className="lg:col-span-1">
//             <PaymentForm 
//               processPayment={processPayment} 
//               isProcessing={processingPayment}
//               balance={balance}
//             />
//           </div>
          
//           {/* <div className="lg:col-span-2">
//             <TransactionHistory 
//               transactions={transactions} 
//               isLoading={isLoading} 
//             />
//           </div> */}
//         </div>
//       </div>
      
//       {/* Modals */}
//       <PaymentStatusModal 
//         status={paymentStatus} 
//         onClose={resetPaymentStatus} 
//       />
      
//       {/* <AddFundsModal 
//         isOpen={showAddFundsModal}
//         onClose={() => setShowAddFundsModal(false)}
//         onAddFunds={addFunds}
//       /> */}
//     </div>
//   );
// };

// export default PaymentGatewayPage;