import React from "react";
import { Wallet, ArrowLeftRight, CreditCard, DollarSign } from "lucide-react";

const PaymentGatewayHeader = ({
  balanceSummary,
  moneyIn = 0,
  moneyOut = 0,
}) => {
  const currency = balanceSummary?.currency || "LKR";
  const available = Number(balanceSummary?.available ?? 0);
  const pending = Number(balanceSummary?.pending ?? 0);
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
            <Wallet className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Pharmacy Digital Wallet
            </h2>
            <p className="text-sm text-gray-500">
              Manage payments and transactions
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 mr-4">
            <p className="text-sm text-indigo-600 font-medium">Available</p>
            <p
              className={`text-2xl font-bold ${
                available < 0 ? "text-red-700" : "text-indigo-700"
              }`}
            >
              {currency} {available.toFixed(2)}
            </p>
            <p className="text-xs text-indigo-500">
              Pending: {currency} {pending.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Last 30 Days</p>
            <p className="text-lg font-semibold text-gray-900">
              Wallet Activity
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Money In</p>
            <p className="text-lg font-semibold text-green-600">
              +{currency} {Number(moneyIn).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <CreditCard className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Money Out</p>
            <p className="text-lg font-semibold text-red-600">
              -{currency} {Number(moneyOut).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayHeader;
