import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  ShoppingCart,
  Phone,
  Clock,
  Filter,
  SortAsc,
  Heart,
  Shield,
  Truck,
  CheckCircle,
  Store,
  Package,
  CreditCard,
  Timer,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useProductPharmacies } from "../hooks/useProductPharmacies";
import { orderService } from "../services/api/OtcOrderService"; // ✅ Import order service
import { useAuth } from "../hooks/useAuth"; // ✅ Import auth hook

const ProductStores = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const { user } = useAuth(); // ✅ Get logged-in user

  // Decode product name from URL
  const decodedProductName = decodeURIComponent(productName);

  // Fetch pharmacies with the product
  const { pharmacies, loading, error } = useProductPharmacies(decodedProductName);

  const [filteredStores, setFilteredStores] = useState([]);
  const [sortBy, setSortBy] = useState("distance");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedStoreState, setSelectedStoreState] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Add loading state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Memoize particle styles to avoid layout jank from randomization on every render
  const particleStyles = useMemo(
    () =>
      Array.from({ length: 15 }, () => ({
        width: `${Math.random() * 6 + 3}px`,
        height: `${Math.random() * 6 + 3}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 20 + 10}s`,
        animationDelay: `${Math.random() * 5}s`,
      })),
    []
  );

  // Helper function to parse delivery time to minutes for consistent comparison
  const parseDeliveryTime = (deliveryTime) => {
    if (!deliveryTime) return 9999;

    const lowerTime = deliveryTime.toLowerCase();

    // Handle special cases
    if (lowerTime.includes("next day")) {
      return 1440; // 24 hours in minutes
    }
    if (lowerTime.includes("24/7") || lowerTime.includes("same day")) {
      return 0; // Immediate availability
    }

    // Extract numeric value and handle different formats
    const numericMatch = deliveryTime.match(/\d+/);
    if (!numericMatch) {
      return 9999; // Unknown/invalid format goes to end
    }

    const parsed = parseInt(numericMatch[0]);

    // Handle different time units
    if (lowerTime.includes("hour")) {
      return parsed * 60; // Convert hours to minutes
    }

    // Default assumption is minutes for values like "30 mins", "45", etc.
    return isNaN(parsed) ? 9999 : parsed;
  };

  // Helper to reset quantity when store changes
  const setSelectedStore = (store) => {
    setSelectedStoreState(store);
    setQuantity(1);
  };

  // Use selectedStoreState as selectedStore for compatibility
  const selectedStore = selectedStoreState;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter and sort pharmacies
  useEffect(() => {
    let filtered = [...pharmacies];

    // Apply filters
    if (filterBy === "inStock") {
      filtered = filtered.filter((store) => store.inStock);
    } else if (filterBy === "verified") {
      filtered = filtered.filter((store) => store.verified);
    } else if (filterBy === "fastDelivery") {
      filtered = filtered.filter(
        (store) => parseDeliveryTime(store.deliveryTime) <= 30
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "deliveryTime":
          return (
            parseDeliveryTime(a.deliveryTime) -
            parseDeliveryTime(b.deliveryTime)
          );
        default:
          return 0;
      }
    });

    setFilteredStores(filtered);
  }, [pharmacies, sortBy, filterBy]);

  const handleOrderClick = (store) => {
    setSelectedStore(store);
    setPaymentMethod("cash");
    setShowOrderModal(true);
  };


  const handlePlaceOrder = async () => {
  if (paymentMethod === "cash") {
    // ✅ Check if user is logged in
    if (!user || !user.id) {
      alert('⚠️ Please login to place an order');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const orderData = {
      customerId: user.id,
      pharmacyId: selectedStore.pharmacyId || selectedStore.id,
      productId: selectedStore.productId || product?.id,
      productName: decodedProductName,
      quantity: quantity,
      price: selectedStore.price,
      totalAmount: selectedStore.price * quantity,
      deliveryFee: selectedStore.deliveryFee,
      paymentMethod: "CASH",  // ✅ Backend enum: CASH, CREDIT_CARD, DEBIT_CARD, DIGITAL_WALLET, INSURANCE
      deliveryAddress: user.address || "Default Address",
      estimatedDeliveryTime: selectedStore.deliveryTime,
      status: "PENDING",
    };

    console.log('📦 Placing order:', orderData);

    try {
      setIsSubmitting(true);

      const response = await orderService.createOrder(orderData);

      console.log('✅ Order created successfully:', response);

      setShowOrderModal(false);

      alert(
        `✅ Order placed successfully!\n\n` +
        `Order ID: ${response.orderId || 'N/A'}\n` +
        `Product: ${decodedProductName}\n` +
        `Quantity: ${quantity}\n` +
        `Total: Rs.${(selectedStore.price * quantity).toFixed(2)}\n` +
        `Delivery Fee: Rs.${selectedStore.deliveryFee.toFixed(2)}\n` +
        `Estimated Delivery: ${selectedStore.deliveryTime}\n\n` +
        `Your order will be delivered soon!`
      );

    } catch (error) {
      console.error('❌ Error placing order:', error);
      
      // ✅ Handle specific error cases
      if (error.message.includes('login') || error.message.includes('forbidden')) {
        alert(
          `🔒 Authentication Required\n\n` +
          `Please login to place an order.\n\n` +
          `You will be redirected to the login page.`
        );
        navigate('/login', { state: { from: location.pathname } });
      } else {
        alert(
          `❌ Failed to place order\n\n` +
          `Error: ${error.message}\n\n` +
          `Please try again or contact support.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  } else {
    setShowPaymentModal(true);
  }
};

  // ✅ UPDATED: Handle Card Payment with API call
  const handleCardPayment = async () => {
    // Prepare order data for card payment
    const orderData = {
      customerId: user?.id || 1,
      pharmacyId: selectedStore.pharmacyId || selectedStore.id,
      productId: selectedStore.productId || product?.id,
      productName: decodedProductName,
      quantity: quantity,
      price: selectedStore.price,
      totalAmount: selectedStore.price * quantity + selectedStore.deliveryFee,
      deliveryFee: selectedStore.deliveryFee,
      paymentMethod: "CREDIT_CARD",  // ✅ Backend enum: CASH, CREDIT_CARD, DEBIT_CARD, DIGITAL_WALLET, INSURANCE
      deliveryAddress: user?.address || "Default Address",
      estimatedDeliveryTime: selectedStore.deliveryTime,
      status: "PENDING",
      // Add card details (you might want to encrypt these)
      cardDetails: {
        cardholderName: cardDetails.cardholderName,
        last4Digits: cardDetails.cardNumber.replace(/\s/g, '').slice(-4),
        // Don't send full card number, CVV to backend for security
      }
    };

    console.log('💳 Processing card payment:', orderData); // Debug log

    try {
      setIsSubmitting(true);

      // ✅ Call API to create order
      const response = await orderService.createOrder(orderData);

      console.log('✅ Payment successful:', response);

      // Close modals
      setShowPaymentModal(false);
      setShowOrderModal(false);

      // Reset card details
      setCardDetails({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      });

      // Show success message
      alert(
        `✅ Payment successful!\n\n` +
        `Order ID: ${response.orderId || 'N/A'}\n` +
        `Product: ${decodedProductName}\n` +
        `Quantity: ${quantity}\n` +
        `Total Paid: Rs.${(selectedStore.price * quantity + selectedStore.deliveryFee).toFixed(2)}\n` +
        `Estimated Delivery: ${selectedStore.deliveryTime}\n\n` +
        `Your order will be delivered soon!`
      );

      // Optional: Navigate to order confirmation
      // navigate(`/customer/orders/${response.orderId}`);

    } catch (error) {
      console.error('❌ Error processing payment:', error);
      alert(
        `❌ Payment failed\n\n` +
        `Error: ${error.message}\n\n` +
        `Please check your card details and try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={12}
          className="fill-yellow-400/50 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} className="text-gray-400" />
      );
    }

    return stars;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Finding pharmacies...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float-random"
            style={style}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
        </div>

        {/* Main Layout: Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Header and Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {/* Product Header */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Find{" "}
                  <span className="text-gradient-primary">{decodedProductName}</span>{" "}
                  Near You
                </h1>
                <p className="text-gray-300 text-sm">
                  {filteredStores.length} stores found
                </p>
              </div>

              {/* Product Info Card */}
              {product && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-xl p-3 flex-shrink-0">
                      {product.image || (pharmacies.length > 0 && pharmacies[0].productImageUrl) ? (
                        <img
                          src={product.image || pharmacies[0].productImageUrl}
                          alt={product.name || decodedProductName}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      ) : (
                        <Package className="w-full h-full text-white/40" />
                      )}
                    </div>
                    <div className="text-center">
                      <h2 className="text-lg font-bold text-white mb-1">
                        {product.name || decodedProductName}
                      </h2>
                      <p className="text-gray-300 text-sm mb-2">
                        {product.description || (pharmacies.length > 0 && pharmacies[0].productDescription)}
                      </p>
                      {product.rating && (
                        <div className="flex items-center justify-center gap-1 mb-3">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-400 ml-1">
                            ({product.rating})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full text-center">
                      {product.category && (
                        <div>
                          <span className="text-xs text-gray-400">Category</span>
                          <p className="text-sm text-white font-medium">
                            {product.category}
                          </p>
                        </div>
                      )}
                      {product.dosage && (
                        <div>
                          <span className="text-xs text-gray-400">Dosage</span>
                          <p className="text-sm text-white font-medium">
                            {product.dosage}
                          </p>
                        </div>
                      )}
                      {product.packSize && (
                        <div>
                          <span className="text-xs text-gray-400">Pack Size</span>
                          <p className="text-sm text-white font-medium">
                            {product.packSize}
                          </p>
                        </div>
                      )}
                      {product.manufacturer && (
                        <div>
                          <span className="text-xs text-gray-400">
                            Manufacturer
                          </span>
                          <p className="text-sm text-white font-medium">
                            {product.manufacturer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Filters and Sort */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Filter & Sort
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      Filter by
                    </label>
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-400" />
                      <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="all" className="bg-gray-800">
                          All Stores
                        </option>
                        <option value="inStock" className="bg-gray-800">
                          In Stock Only
                        </option>
                        <option value="verified" className="bg-gray-800">
                          Verified Only
                        </option>
                        <option value="fastDelivery" className="bg-gray-800">
                          Fast Delivery (≤30 min)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      Sort by
                    </label>
                    <div className="flex items-center gap-2">
                      <SortAsc size={16} className="text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="distance" className="bg-gray-800">
                          Distance
                        </option>
                        <option value="price" className="bg-gray-800">
                          Price: Low to High
                        </option>
                        <option value="rating" className="bg-gray-800">
                          Highest Rated
                        </option>
                        <option value="deliveryTime" className="bg-gray-800">
                          Fastest Delivery
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Pharmacy List (Scrollable) */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Available Stores
            </h2>

            {filteredStores.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Pharmacies Found
                </h3>
                <p className="text-gray-300 mb-6">
                  This product is currently not available at any pharmacy near you.
                </p>
                <button
                  onClick={() => navigate("/otc")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Other Products
                </button>
              </div>
            ) : (
              <div className="h-[calc(120vh-200px)] overflow-y-auto pl-4 space-y-4 scrollbar-hide">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row items-start gap-6">
                      {/* Store Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-white">
                                {store.name}
                              </h3>
                              {store.verified && (
                                <CheckCircle
                                  size={16}
                                  className="text-blue-400"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                {store.address}
                              </div>
                              <span>•</span>
                              <span>{store.distance}</span>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Heart size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {renderStars(store.rating)}
                            </div>
                            <span className="text-sm text-gray-400">
                              ({store.reviews})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Clock size={14} />
                            {store.openTime}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Phone size={14} />
                            {store.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Truck size={14} />
                            {store.deliveryTime}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {store.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price and Order Section */}
                      <div className="flex flex-col items-end gap-4 min-w-[200px]">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-white">
                              Rs.{store.price.toFixed(2)}
                            </span>
                            {store.originalPrice > store.price && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  Rs.{store.originalPrice.toFixed(2)}
                                </span>
                                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                  {store.discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            + Rs.{store.deliveryFee.toFixed(2)} delivery
                          </div>
                        </div>

                        <div className="text-right text-sm">
                          {store.inStock ? (
                            <div className="text-green-400 flex items-center gap-1">
                              <Package size={14} />
                              {store.stockCount} in stock
                            </div>
                          ) : (
                            <div className="text-red-400 flex items-center gap-1">
                              <Package size={14} />
                              Out of stock
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleOrderClick(store)}
                          disabled={!store.inStock}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            store.inStock
                              ? "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl"
                              : "bg-gray-600 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart size={16} />
                          {store.inStock ? "Order Now" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Modal - ✅ UPDATED with loading state */}
        {showOrderModal && selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-12 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Place Order</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm text-gray-400">Product</span>
                  <p className="text-white font-medium">{decodedProductName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Store</span>
                  <p className="text-white font-medium">{selectedStore.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Price per item</span>
                  <p className="text-white font-medium">
                    Rs.{selectedStore.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedStore.stockCount}
                    value={quantity}
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value) || 1;
                      const validQuantity = Math.min(
                        Math.max(1, inputValue),
                        selectedStore.stockCount
                      );
                      setQuantity(validQuantity);
                    }}
                    className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white focus:outline-none ${
                      quantity > selectedStore.stockCount
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/20 focus:border-blue-500"
                    }`}
                  />
                  {quantity > selectedStore.stockCount && (
                    <p className="text-red-400 text-xs mt-1">
                      Only {selectedStore.stockCount} items available in stock
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    Available: {selectedStore.stockCount} items
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 focus:ring-blue-500"
                      />
                      <span className="text-white">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 focus:ring-blue-500"
                      />
                      <span className="text-white">Credit/Debit Card</span>
                    </label>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total:</span>
                    <span>
                      Rs.{(selectedStore.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      {paymentMethod === "cash"
                        ? "Confirm Order"
                        : "Proceed to Payment"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Payment Modal - ✅ UPDATED with loading state */}
        {showPaymentModal && selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full mt-16">
              <h3 className="text-xl font-bold text-white mb-4">
                Payment Details
              </h3>

              <div className="space-y-4 mb-6">
                {/* Order Summary */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-medium mb-2">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>
                        {decodedProductName} x {quantity}
                      </span>
                      <span>
                        Rs.{(selectedStore.price * quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>Rs.{selectedStore.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between text-white font-bold">
                        <span>Total</span>
                        <span>
                          Rs.
                          {(
                            selectedStore.price * quantity +
                            selectedStore.deliveryFee
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details Form */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardholderName}
                    onChange={(e) =>
                      handleCardInputChange("cardholderName", e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\s+/g, "")
                        .replace(/[^0-9]/gi, "");
                      const formattedValue =
                        value.match(/.{1,4}/g)?.join(" ") || value;
                      handleCardInputChange("cardNumber", formattedValue);
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length === 0) {
                          handleCardInputChange("expiryDate", "");
                          return;
                        }
                        value = value.slice(0, 4);
                        let formattedValue = value;
                        if (value.length >= 2) {
                          let month = value.slice(0, 2);
                          if (parseInt(month, 10) < 1) {
                            month = "01";
                          } else if (parseInt(month, 10) > 12) {
                            month = "12";
                          } else if (month.length === 1) {
                            formattedValue = month;
                          }
                          formattedValue = month;
                          if (value.length > 2) {
                            formattedValue += "/" + value.slice(2, 4);
                          }
                        }
                        handleCardInputChange("expiryDate", formattedValue);
                      }}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleCardInputChange("cvv", value);
                      }}
                      placeholder="123"
                      maxLength="4"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg p-3">
                  <Shield size={14} />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setCardDetails({
                      cardNumber: "",
                      expiryDate: "",
                      cvv: "",
                      cardholderName: "",
                    });
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCardPayment}
                  disabled={
                    isSubmitting ||
                    !cardDetails.cardNumber ||
                    !cardDetails.expiryDate ||
                    !cardDetails.cvv ||
                    !cardDetails.cardholderName
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Pay Rs.
                      {(
                        selectedStore.price * quantity +
                        selectedStore.deliveryFee
                      ).toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductStores;





