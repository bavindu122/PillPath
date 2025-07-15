import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";

const OrderPreview = () => {
  const { prescriptionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { pharmacyName } = location.state || {};

  const [medications, setMedications] = React.useState([
    { id: 1, name: "Amoxicillin 500mg", price: 15.99, selected: false, quantity: "30 tablets" },
    { id: 2, name: "Ibuprofen 200mg", price: 8.50, selected: false, quantity: "60 tablets" },
    { id: 3, name: "Vitamin D3 1000IU", price: 12.25, selected: false, quantity: "90 capsules" },
    { id: 4, name: "Lisinopril 10mg", price: 9.75, selected: false, quantity: "30 tablets" }
  ]);

  const totalPrice = medications.reduce((sum, med) => sum + (med.selected ? med.price : 0), 0);

  const handleMedicationToggle = (id) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, selected: !med.selected } : med
      )
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleProceedToPayment = () => {
    console.log("Proceeding to payment...");
  };

  const handleOrderFromAnotherPharmacy = () => {
    console.log("Ordering from another pharmacy...");
  };

  const unavailableMedications = [
    "Metformin 500mg",
    "Atorvastatin 20mg", 
    "Omeprazole 40mg",
    "Levothyroxine 75mcg"
  ];

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Ongoing Activities</span>
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">Order Preview</h1>
          <p className="text-white/70 text-lg">Review your prescription order details</p>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6">
            {/* Order Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Prescription Order #{prescriptionId}</h2>
              <div className="space-y-2">
                <div className="flex items-center text-white/70">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Uploaded: January 15, 2024</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Time: 2:30 PM</span>
                </div>
                <div className="flex items-center text-white/70">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Pharmacy: {pharmacyName || "Rite Aid"}</span>
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex gap-6 items-stretch">
              {/* Left Column */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-4">Available Items</h3>
                <div className="space-y-3">
                  {medications.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4 flex-1">
                        <input
                          type="checkbox"
                          id={`medication-${medication.id}`}
                          checked={medication.selected}
                          onChange={() => handleMedicationToggle(medication.id)}
                          className="w-5 h-5 text-green-600 bg-white/10 border-white/30 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{medication.name}</h4>
                          <p className="text-white/60 text-sm">{medication.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold text-lg ${medication.selected ? 'text-white' : 'text-white/50'}`}>
                          ${medication.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Price */}
                <div className="border-t border-white/10 pt-4 mt-6">
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-xl font-bold text-white">Total Price</span>
                    <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleProceedToPayment}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Proceed to Payment</span>
                  </button>
                </div>


              </div>

              {/* Right Column - Prescription Image */}
              <div className="flex-shrink-0 mt-[-113px]"> {/* Adjust this value as needed */}
                <h3 className="text-lg font-semibold text-white mb-3">Prescription Image</h3>
                <div className="w-100 h-120 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <img src="/src/assets/img/prescription.jpeg" 
                    alt="Prescription" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

            {/* Unavailable Items - Full Width */}
            <div className="pt-8 border-t border-white/10 mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Unavailable Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unavailableMedications.map((medication, index) => (
                  <div key={index} className="p-4 bg-red-500/10 backdrop-blur-sm rounded-lg border border-red-500/20">
                    <h4 className="text-red-300 font-medium">{medication}</h4>
                    <p className="text-red-200/60 text-sm mt-1">Currently out of stock</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleOrderFromAnotherPharmacy}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Order from Another Pharmacy</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderPreview;
