import React from 'react';
import { Wallet, ArrowLeftRight, CreditCard, DollarSign, PlusCircle } from 'lucide-react';

const PaymentGatewayHeader = ({ balance, onAddFunds }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
            <Wallet className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pharmacy Digital Wallet</h2>
            <p className="text-sm text-gray-500">Manage payments and transactions</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 mr-4">
            <p className="text-sm text-indigo-600 font-medium">Outstanding Bill</p>
            <p className="text-2xl font-bold text-indigo-700">Rs.{balance.toFixed(2)}</p>
          </div>
          
          {/* <button
            onClick={onAddFunds}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Funds
          </button> */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Last 30 Days</p>
            <p className="text-lg font-semibold text-gray-900">24 Transactions</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Money In</p>
            <p className="text-lg font-semibold text-green-600">+Rs.3,240.50</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <CreditCard className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Money Out</p>
            <p className="text-lg font-semibold text-red-600">-Rs.2,157.75</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayHeader;