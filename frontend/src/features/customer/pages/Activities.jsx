import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  User, 
  Truck, 
  AlertCircle,
  Calendar,
  Pill,
  CreditCard
} from "lucide-react";
import PaymentModal from "../../../components/UIs/PaymentModal";

const Activities = () => {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = React.useState('');
  const [selectedPharmacyName, setSelectedPharmacyName] = React.useState('');

  const handleViewOrderPreview = (prescriptionId, pharmacyName) => {
    // Navigate to a new page with prescription and pharmacy details
    navigate(`/customer/order-preview/${prescriptionId}`, {
      state: { pharmacyName }
    });
  };

  const handleProceedToPayment = (prescriptionId, pharmacyName) => {
    setSelectedPrescriptionId(prescriptionId);
    setSelectedPharmacyName(pharmacyName);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPrescriptionId('');
    setSelectedPharmacyName('');
  };

  const handleConfirmPayment = (paymentMethod, finalTotal) => {
    console.log(`Payment confirmed for ${selectedPrescriptionId} with ${paymentMethod} for $${finalTotal.toFixed(2)}`);
    // Add your payment processing logic here
    setShowPaymentModal(false);
  };

  // Sample medications for the payment modal
  const sampleMedications = [
    { id: 1, name: "Amoxicillin 500mg", price: 15.99, selected: true },
    { id: 2, name: "Ibuprofen 200mg", price: 8.50, selected: true },
    { id: 3, name: "Vitamin D3 1000IU", price: 12.25, selected: false },
    { id: 4, name: "Lisinopril 10mg", price: 9.75, selected: true }
  ];

  
  

  const prescriptions = [
    {
      id: "RX-250714-01",
      uploadedDate: "July 14, 2025 • 2:30 PM",
      prescriptionImage: "/src/assets/img/prescription.jpeg",
      pharmacies: [
        {
          name: "Rite Aid",
          address: "9012 Pine St, Uptown",
          status: "View Order Preview",
          statusType: "delivery",
          iconBg: "bg-blue-100",
          iconColor: "text-orange-600"
        },
        {
          name: "Walgreens",
          address: "5678 Oak Ave, Midtown",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        },
        {
          name: "CVS Pharmacy",
          address: "1234 Main St, Downtown",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        }
      ]
    },
    {
      id: "RX-250715-02",
      uploadedDate: "July 15, 2025 • 10:15 AM",
      prescriptionImage: "/src/assets/img/prescription.jpeg",
      pharmacies: [
        {
         name: "Rite Aid",
          address: "9012 Pine St, Uptown",
          status: "View Order Preview",
          statusType: "delivery",
          iconBg: "bg-blue-100",
          iconColor: "text-orange-600"
        },
        {
          name: "Local Health Pharmacy",
          address: "7890 Cedar Rd, Eastside",
          status: "View Order Preview",
          statusType: "delivery",
          iconBg: "bg-blue-100",
          iconColor: "text-orange-600"
        },
        {
          name: "MedPlus Pharmacy",
          address: "2468 Maple Ave, Northside",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        }
      ]
    },
    {
      id: "RX-250714-03",
      uploadedDate: "July 14, 2025 • 3:45 PM",
      prescriptionImage: "/src/assets/img/prescription.jpeg",
      pharmacies: [
        {
          name: "Kroger Pharmacy",
          address: "1357 Broadway, Central",
          status: "Proceed to payment",
          statusType: "payment",
          iconBg: "bg-green-100",
          iconColor: "text-green-600"
        }
      ]
    },
    {
      id: "RX-250715-04",
      uploadedDate: "July 15, 2025 • 8:20 AM",
      prescriptionImage: "/src/assets/img/prescription.jpeg",
      pharmacies: [
        {
          name: "Costco Pharmacy",
          address: "8642 Valley Rd, Hillside",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600"
        },
        {
          name: "Giant Pharmacy",
          address: "4321 River St, Riverside",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        },
        {
          name: "Publix Pharmacy",
          address: "5678 Ocean Dr, Seaside",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        },
        {
          name: "Walmart Pharmacy",
          address: "9876 Mountain Ave, Highland",
          status: "Pending Order Preview",
          statusType: "pending",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        }
      ]
    }
  ];

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "delivery":
        return <Truck className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-300/30";
      case "delivery":
        return "bg-orange-500/20 text-orange-300 border-orange-300/30";
      case "payment":
        return "bg-green-500/20 text-green-300 border-green-300/30";
    }
  };

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        

        {/* Ongoing Activities Section */}
        <div className="mb-8 bg-black/20 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-white">Ongoing Activities</h2>
          </div>
          <p className="text-white/70 text-lg">Track your prescription orders and delivery status</p>
        </div>

        <div className="space-y-8">
          {prescriptions.map((prescription, index) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
            >
              {/* Prescription Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/30">
                      <Pill className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{prescription.id}</h2>
                      <div className="flex items-center text-white/60 text-sm mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Uploaded: {prescription.uploadedDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prescription Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                      <img 
                        src={prescription.prescriptionImage} 
                        alt="Prescription"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pharmacy Cards */}
              <div className="p-6">
                <div className="space-y-4">
                  {prescription.pharmacies.map((pharmacy, pharmacyIndex) => (
                    <motion.div
                      key={`${prescription.id}-${pharmacyIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + (pharmacyIndex * 0.05) }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Pharmacy Icon */}
                          <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          
                          {/* Pharmacy Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {pharmacy.name}
                            </h3>
                            
                            <div className="flex items-center text-white/60">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="text-sm">{pharmacy.address}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center space-x-3">
                          <span 
                            onClick={() => {
                              if (pharmacy.status === "View Order Preview") {
                                handleViewOrderPreview(prescription.id, pharmacy.name);
                              } else if (pharmacy.status === "Proceed to payment") {
                                handleProceedToPayment(prescription.id, pharmacy.name);
                              }
                            }}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pharmacy.statusType)} ${
                              pharmacy.status === "View Order Preview" || pharmacy.status === "Proceed to payment" ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
                            }`}
                          >
                            {getStatusIcon(pharmacy.statusType)}
                            <span className="ml-1">{pharmacy.status}</span>
                          </span>
                          
                          {/* Action Arrow */}
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="text-white/60 hover:text-white transition-colors cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          prescriptionId={selectedPrescriptionId}
          pharmacyName={selectedPharmacyName}
          medications={sampleMedications}
          discountPercentage={10}
          onConfirmPayment={handleConfirmPayment}
        />
      </div>
    </div>
  );
};

export default Activities;
