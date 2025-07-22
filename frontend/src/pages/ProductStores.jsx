import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

// Import your actual images
import allergyReliefImg from "../assets/img/meds/allergy_relief.jpg";
import antacidImg from "../assets/img/meds/Antacid.jpg";
import coughSyrupImg from "../assets/img/meds/cough_syrup.jpg";
import ibuprofenImg from "../assets/img/meds/Ibuprofen.jpg";
import panadolImg from "../assets/img/meds/Panadol.jpg";
import paracetamolImg from "../assets/img/meds/paracetamol.webp";
import vitaminCImg from "../assets/img/meds/Vitamin_c.jpg";

// Mock data for products
const productData = {
  1: {
    id: 1,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer",
    image: paracetamolImg,
    rating: 4.5,
    category: "Pain Relief",
    manufacturer: "Generic Pharma",
    dosage: "500mg",
    packSize: "20 tablets",
  },
  2: {
    id: 2,
    name: "Ibuprofen",
    description: "Anti-inflammatory pain relief",
    image: ibuprofenImg,
    rating: 4.3,
    category: "Pain Relief",
    manufacturer: "MediCorp",
    dosage: "400mg",
    packSize: "30 tablets",
  },
  3: {
    id: 3,
    name: "Vitamin C",
    description: "Immune system support",
    image: vitaminCImg,
    rating: 4.7,
    category: "Vitamins",
    manufacturer: "VitaPlus",
    dosage: "1000mg",
    packSize: "60 tablets",
  },
  4: {
    id: 4,
    name: "Cough Syrup",
    description: "Relieves cough and throat irritation",
    image: coughSyrupImg,
    rating: 4.2,
    category: "Cold & Flu",
    manufacturer: "CoughCare",
    dosage: "100ml",
    packSize: "1 bottle",
  },
  5: {
    id: 5,
    name: "Antacid",
    description: "Relieves heartburn and indigestion",
    image: antacidImg,
    rating: 4.4,
    category: "Digestive",
    manufacturer: "DigestEase",
    dosage: "10ml",
    packSize: "200ml bottle",
  },
  6: {
    id: 6,
    name: "Allergy Relief",
    description: "Reduces allergy symptoms",
    image: allergyReliefImg,
    rating: 4.6,
    category: "Allergy",
    manufacturer: "AllerCare",
    dosage: "10mg",
    packSize: "30 tablets",
  },
};

// Mock data for stores with the product
const mockStores = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    address: "123 Main St, Downtown",
    distance: "0.5 km",
    rating: 4.8,
    reviews: 324,
    phone: "+1 (555) 123-4567",
    openTime: "24/7",
    price: 8.99,
    originalPrice: 12.99,
    discount: 31,
    inStock: true,
    stockCount: 15,
    deliveryTime: "30 mins",
    deliveryFee: 2.99,
    verified: true,
    features: [
      "Free Delivery over $25",
      "Prescription Available",
      "Insurance Accepted",
    ],
  },
  {
    id: 2,
    name: "MediCare Central",
    address: "456 Oak Avenue, Midtown",
    distance: "1.2 km",
    rating: 4.6,
    reviews: 198,
    phone: "+1 (555) 987-6543",
    openTime: "8 AM - 10 PM",
    price: 9.49,
    originalPrice: 11.99,
    discount: 21,
    inStock: true,
    stockCount: 8,
    deliveryTime: "45 mins",
    deliveryFee: 3.99,
    verified: true,
    features: ["Senior Discounts", "Loyalty Program", "Online Consultation"],
  },
  {
    id: 3,
    name: "QuickMeds Express",
    address: "789 Pine Street, Uptown",
    distance: "2.1 km",
    rating: 4.4,
    reviews: 276,
    phone: "+1 (555) 456-7890",
    openTime: "7 AM - 11 PM",
    price: 10.99,
    originalPrice: 13.99,
    discount: 21,
    inStock: true,
    stockCount: 25,
    deliveryTime: "25 mins",
    deliveryFee: 1.99,
    verified: false,
    features: ["Fast Delivery", "Mobile App", "Contactless Payment"],
  },
  {
    id: 4,
    name: "Family Health Store",
    address: "321 Elm Road, Riverside",
    distance: "3.5 km",
    rating: 4.2,
    reviews: 142,
    phone: "+1 (555) 321-0987",
    openTime: "9 AM - 9 PM",
    price: 7.99,
    originalPrice: 9.99,
    discount: 20,
    inStock: false,
    stockCount: 0,
    deliveryTime: "Next Day",
    deliveryFee: 4.99,
    verified: true,
    features: ["Family Owned", "Personal Service", "Health Consultations"],
  },
  {
    id: 5,
    name: "Metro Pharmacy Chain",
    address: "654 Broadway, City Center",
    distance: "4.2 km",
    rating: 4.7,
    reviews: 512,
    phone: "+1 (555) 654-3210",
    openTime: "24/7",
    price: 11.49,
    originalPrice: 14.99,
    discount: 23,
    inStock: true,
    stockCount: 50,
    deliveryTime: "20 mins",
    deliveryFee: 0,
    verified: true,
    features: ["Free Delivery", "Membership Rewards", "Drive-Through"],
  },
];

const ProductStores = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stores, setStores] = useState(mockStores);
  const [filteredStores, setFilteredStores] = useState(mockStores);
  const [sortBy, setSortBy] = useState("distance");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  useEffect(() => {
    // Get product data
    const productInfo = productData[productId];
    if (productInfo) {
      setProduct(productInfo);
    } else {
      // Handle product not found
      navigate("/404");
    }
  }, [productId, navigate]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...stores];

    // Apply filters
    if (filterBy === "inStock") {
      filtered = filtered.filter((store) => store.inStock);
    } else if (filterBy === "verified") {
      filtered = filtered.filter((store) => store.verified);
    } else if (filterBy === "fastDelivery") {
      filtered = filtered.filter((store) => parseInt(store.deliveryTime) <= 30);
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
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        default:
          return 0;
      }
    });

    setFilteredStores(filtered);
  }, [stores, sortBy, filterBy]);

  const handleOrderClick = (store) => {
    setSelectedStore(store);
    setShowOrderModal(true);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "cash") {
      // Handle cash payment - simply close modal and confirm order
      console.log("Order placed with cash payment:", {
        product: product,
        store: selectedStore,
        quantity: quantity,
        total: (selectedStore.price * quantity).toFixed(2),
        paymentMethod: "cash",
      });
      setShowOrderModal(false);
      // You can add navigation to order confirmation page or show success message
    } else {
      // Show card payment modal
      setShowPaymentModal(true);
    }
  };

  const handleCardPayment = () => {
    // Handle card payment logic here
    console.log("Order placed with card payment:", {
      product: product,
      store: selectedStore,
      quantity: quantity,
      total: (selectedStore.price * quantity).toFixed(2),
      paymentMethod: "card",
      cardDetails: cardDetails,
    });
    setShowPaymentModal(false);
    setShowOrderModal(false);
    // Reset form
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    // You can add navigation to order confirmation page or show success message
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float-random"
            style={{
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
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
                  <span className="text-gradient-primary">{product.name}</span>{" "}
                  Near You
                </h1>
                <p className="text-gray-300 text-sm">
                  {filteredStores.length} stores found
                </p>
              </div>

              {/* Product Info Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-xl p-3 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-white mb-1">
                      {product.name}
                    </h2>
                    <p className="text-gray-300 text-sm mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-400 ml-1">
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full text-center">
                    <div>
                      <span className="text-xs text-gray-400">Category</span>
                      <p className="text-sm text-white font-medium">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Dosage</span>
                      <p className="text-sm text-white font-medium">
                        {product.dosage}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Pack Size</span>
                      <p className="text-sm text-white font-medium">
                        {product.packSize}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">
                        Manufacturer
                      </span>
                      <p className="text-sm text-white font-medium">
                        {product.manufacturer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                            Rs.{store.price}
                          </span>
                          {store.originalPrice > store.price && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                Rs.{store.originalPrice}
                              </span>
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                {store.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          + Rs.{store.deliveryFee} delivery
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
          </div>
        </div>

        {/* Order Modal */}
        {showOrderModal && selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-12 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Place Order</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm text-gray-400">Product</span>
                  <p className="text-white font-medium">{product.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Store</span>
                  <p className="text-white font-medium">{selectedStore.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Price per item</span>
                  <p className="text-white font-medium">
                    Rs.{selectedStore.price}
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
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
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
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  {paymentMethod === "cash"
                    ? "Confirm Order"
                    : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Payment Modal */}
        {showPaymentModal && selectedStore && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full">
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
                        {product.name} x {quantity}
                      </span>
                      <span>
                        Rs.{(selectedStore.price * quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>Rs.{selectedStore.deliveryFee}</span>
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
                      // Format card number with spaces
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
                        // Format as MM/YY
                        const value = e.target.value.replace(/\D/g, "");
                        const formattedValue = value.replace(
                          /(\d{2})(\d{2})/,
                          "$1/$2"
                        );
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
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleCardPayment}
                  disabled={
                    !cardDetails.cardNumber ||
                    !cardDetails.expiryDate ||
                    !cardDetails.cvv ||
                    !cardDetails.cardholderName
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard size={16} />
                  Pay Rs.
                  {(
                    selectedStore.price * quantity +
                    selectedStore.deliveryFee
                  ).toFixed(2)}
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
