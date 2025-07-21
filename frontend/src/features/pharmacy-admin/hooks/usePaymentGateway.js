import { useState, useEffect, useCallback } from 'react';

const usePaymentGateway = () => {
  const [balance, setBalance] = useState(100.00);
  const [transactions, setTransactions] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending', null
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Load saved cards from localStorage on component mount
  useEffect(() => {
    const loadSavedCards = () => {
      const storedCards = localStorage.getItem('savedCards');
      if (storedCards) {
        try {
          setSavedCards(JSON.parse(storedCards));
        } catch (error) {
          console.error('Error parsing saved cards:', error);
          // If there's an error, just start with empty array
          setSavedCards([]);
        }
      }
    };
    
    loadSavedCards();
  }, []);
  
  // Generate initial mock transaction history
  useEffect(() => {
    const generateTransactions = () => {
      setIsLoading(true);
      
      const types = ['credit', 'debit'];
      const categories = ['Purchase', 'Refund', 'Supplier Payment', 'Insurance Reimbursement'];
      const recipients = ['MediSupply Co.', 'PharmTech Inc.', 'HealthCare Systems', 'Med Insurance Inc.', 'Customer Refund'];
      
      const mockTransactions = Array.from({ length: 15 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const type = types[Math.floor(Math.random() * types.length)];
        const amount = +(Math.random() * 1000 + 50).toFixed(2);
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        let recipient;
        if (category === 'Refund') {
          recipient = 'Customer Refund';
        } else if (category === 'Insurance Reimbursement') {
          recipient = 'Med Insurance Inc.';
        } else {
          recipient = recipients[Math.floor(Math.random() * (recipients.length - 1))];
        }
        
        return {
          id: `TRX-${(10000 + index).toString()}`,
          date,
          type,
          amount,
          balance: 0, // Will be calculated below
          category,
          recipient,
          status: 'completed'
        };
      });
      
      // Sort transactions by date (newest first)
      mockTransactions.sort((a, b) => b.date - a.date);
      
      // Calculate running balance
      let runningBalance = balance;
      for (let i = 0; i < mockTransactions.length; i++) {
        if (mockTransactions[i].type === 'debit') {
          runningBalance += mockTransactions[i].amount;
        } else {
          runningBalance -= mockTransactions[i].amount;
        }
        mockTransactions[i].balance = +runningBalance.toFixed(2);
      }
      
      setTransactions(mockTransactions);
      setIsLoading(false);
    };
    
    generateTransactions();
  }, []);

  // Process a payment
  const processPayment = useCallback(async (paymentDetails) => {
    setProcessingPayment(true);
    setPaymentStatus('pending');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Simulate 85% success rate
      const isSuccessful = Math.random() < 0.85;
      
      if (isSuccessful) {
        // Sanitize the card details for transaction record (only keep last 4 digits)
        const cardNumber = paymentDetails.cardNumber 
          ? `****${paymentDetails.cardNumber.replace(/\s/g, '').slice(-4)}`
          : null;
        
        const newTransaction = {
          id: `TRX-${(10000 + transactions.length).toString()}`,
          date: new Date(),
          type: 'credit', // payment going out
          amount: +parseFloat(paymentDetails.amount).toFixed(2),
          balance: +(balance - parseFloat(paymentDetails.amount)).toFixed(2),
          category: 'Payment',
          recipient: 'Payment Processor',
          status: 'completed',
          method: 'Credit Card',
          cardDetails: cardNumber,
          reference: `REF-${Date.now().toString().substring(6)}`
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setBalance(prev => +(prev - parseFloat(paymentDetails.amount)).toFixed(2));
        setPaymentStatus('success');
        
        // Update lastUsed timestamp for the card if it was a saved card
        if (paymentDetails.cardId) {
          updateCardLastUsed(paymentDetails.cardId);
        }
      } else {
        // Failed payment
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStatus('failed');
    } finally {
      setProcessingPayment(false);
    }
  }, [balance, transactions]);

  // Add funds to wallet (for simulation purposes)
  const addFunds = useCallback(async (amount) => {
    setProcessingPayment(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTransaction = {
      id: `TRX-${(10000 + transactions.length).toString()}`,
      date: new Date(),
      type: 'debit', // money coming in
      amount: +parseFloat(amount).toFixed(2),
      balance: +(balance + parseFloat(amount)).toFixed(2),
      category: 'Deposit',
      recipient: 'Wallet Funding',
      status: 'completed'
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => +(prev + parseFloat(amount)).toFixed(2));
    setProcessingPayment(false);
  }, [balance, transactions]);

  // Save a new card
  const saveCard = useCallback((cardData) => {
    // Don't save duplicates (check by last 4 digits of card number)
    const last4 = cardData.cardNumber.replace(/\s/g, '').slice(-4);
    const isDuplicate = savedCards.some(card => 
      card.cardNumber.replace(/\s/g, '').slice(-4) === last4
    );
    
    if (isDuplicate) {
      return false;
    }
    
    // Mask the card number for storage (keep only last 4 digits)
    const maskedCardNumber = `**** **** **** ${last4}`;
    
    const newCard = {
      ...cardData,
      cardNumber: maskedCardNumber
    };
    
    const updatedCards = [...savedCards, newCard];
    setSavedCards(updatedCards);
    
    // Store in localStorage (in a real app, this would be stored server-side)
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
    
    return true;
  }, [savedCards]);

  // Delete a saved card
  const deleteCard = useCallback((cardId) => {
    const updatedCards = savedCards.filter(card => card.id !== cardId);
    setSavedCards(updatedCards);
    
    // Update localStorage
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  }, [savedCards]);

  // Update the last used timestamp for a card
  const updateCardLastUsed = useCallback((cardId) => {
    const updatedCards = savedCards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          lastUsed: new Date().toISOString()
        };
      }
      return card;
    });
    
    setSavedCards(updatedCards);
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  }, [savedCards]);

  // Reset payment status
  const resetPaymentStatus = useCallback(() => {
    setPaymentStatus(null);
  }, []);

  return {
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
  };
};

export default usePaymentGateway;

































// import { useState, useEffect, useCallback } from 'react';

// const usePaymentGateway = () => {
//   const [balance, setBalance] = useState(5000.00);
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending', null
//   const [processingPayment, setProcessingPayment] = useState(false);
  
//   // Generate initial mock transaction history
//   useEffect(() => {
//     const generateTransactions = () => {
//       setIsLoading(true);
      
//       const types = ['credit', 'debit'];
//       const categories = ['Purchase', 'Refund', 'Supplier Payment', 'Insurance Reimbursement'];
//       const recipients = ['MediSupply Co.', 'PharmTech Inc.', 'HealthCare Systems', 'Med Insurance Inc.', 'Customer Refund'];
      
//       const mockTransactions = Array.from({ length: 15 }, (_, index) => {
//         const date = new Date();
//         date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
//         const type = types[Math.floor(Math.random() * types.length)];
//         const amount = +(Math.random() * 1000 + 50).toFixed(2);
//         const category = categories[Math.floor(Math.random() * categories.length)];
        
//         let recipient;
//         if (category === 'Refund') {
//           recipient = 'Customer Refund';
//         } else if (category === 'Insurance Reimbursement') {
//           recipient = 'Med Insurance Inc.';
//         } else {
//           recipient = recipients[Math.floor(Math.random() * (recipients.length - 1))];
//         }
        
//         return {
//           id: `TRX-${(10000 + index).toString()}`,
//           date,
//           type,
//           amount,
//           balance: 0, // Will be calculated below
//           category,
//           recipient,
//           status: 'completed'
//         };
//       });
      
//       // Sort transactions by date (newest first)
//       mockTransactions.sort((a, b) => b.date - a.date);
      
//       // Calculate running balance
//       let runningBalance = balance;
//       for (let i = 0; i < mockTransactions.length; i++) {
//         if (mockTransactions[i].type === 'debit') {
//           runningBalance += mockTransactions[i].amount;
//         } else {
//           runningBalance -= mockTransactions[i].amount;
//         }
//         mockTransactions[i].balance = +runningBalance.toFixed(2);
//       }
      
//       setTransactions(mockTransactions);
//       setIsLoading(false);
//     };
    
//     generateTransactions();
//   }, []);

//   // Process a payment
//   const processPayment = useCallback(async (paymentDetails) => {
//     setProcessingPayment(true);
//     setPaymentStatus('pending');
    
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     try {
//       // Simulate 85% success rate
//       const isSuccessful = Math.random() < 0.85;
      
//       if (isSuccessful) {
//         const newTransaction = {
//           id: `TRX-${(10000 + transactions.length).toString()}`,
//           date: new Date(),
//           type: 'credit', // payment going out
//           amount: +parseFloat(paymentDetails.amount).toFixed(2),
//           balance: +(balance - parseFloat(paymentDetails.amount)).toFixed(2),
//           category: paymentDetails.category || 'Payment',
//           recipient: paymentDetails.recipient,
//           status: 'completed',
//           method: paymentDetails.method,
//           reference: paymentDetails.reference || `REF-${Date.now().toString().substring(6)}`
//         };
        
//         setTransactions(prev => [newTransaction, ...prev]);
//         setBalance(prev => +(prev - parseFloat(paymentDetails.amount)).toFixed(2));
//         setPaymentStatus('success');
//       } else {
//         // Failed payment
//         setPaymentStatus('failed');
//       }
//     } catch (error) {
//       console.error('Payment processing error:', error);
//       setPaymentStatus('failed');
//     } finally {
//       setProcessingPayment(false);
//     }
//   }, [balance, transactions]);

//   // Add funds to wallet (for simulation purposes)
//   const addFunds = useCallback(async (amount) => {
//     setProcessingPayment(true);
    
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     const newTransaction = {
//       id: `TRX-${(10000 + transactions.length).toString()}`,
//       date: new Date(),
//       type: 'debit', // money coming in
//       amount: +parseFloat(amount).toFixed(2),
//       balance: +(balance + parseFloat(amount)).toFixed(2),
//       category: 'Deposit',
//       recipient: 'Wallet Funding',
//       status: 'completed'
//     };
    
//     setTransactions(prev => [newTransaction, ...prev]);
//     setBalance(prev => +(prev + parseFloat(amount)).toFixed(2));
//     setProcessingPayment(false);
//   }, [balance, transactions]);

//   // Reset payment status
//   const resetPaymentStatus = useCallback(() => {
//     setPaymentStatus(null);
//   }, []);

//   return {
//     balance,
//     transactions,
//     isLoading,
//     paymentStatus,
//     processingPayment,
//     processPayment,
//     addFunds,
//     resetPaymentStatus
//   };
// };

// export default usePaymentGateway;