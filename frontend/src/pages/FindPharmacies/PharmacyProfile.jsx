import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Star, MapPin, Clock, Phone, Globe, Share2, Package, ArrowRight, MessageCircle, Truck, ShieldCheck, Syringe, Check, Mail } from "lucide-react";
import ProfileHeader from "./components/ProfileHeader";
import ReviewsSection from "./components/ReviewsSection";
import OTCStorefront from "./components/OTCStorefront";
import ContactInfo from "./components/ContactInfo";
import ServicesSection from "./components/ServicesSection";
import OpeningHours from "./components/OpeningHours";
import { usePharmacyProfile } from "./hooks/usePharmacyProfile";

// Import images for mini components
import panadolImg from "../../assets/img/meds/Panadol.jpg";
import paracetamolImg from "../../assets/img/meds/paracetamol.webp";
import ibuprofenImg from "../../assets/img/meds/Ibuprofen.jpg";
import vitaminCImg from "../../assets/img/meds/Vitamin_c.jpg";
import coughSyrupImg from "../../assets/img/meds/cough_syrup.jpg";
import antacidImg from "../../assets/img/meds/Antacid.jpg";
import allergyReliefImg from "../../assets/img/meds/allergy_relief.jpg";

const PharmacyProfile = () => {
  const { pharmacyId } = useParams();
  // Use pharmacyId from URL params, or default to "1" if not provided
  const actualPharmacyId = pharmacyId || "1";
  const { pharmacy, loading, error, reviews, otcProducts } = usePharmacyProfile(actualPharmacyId);
  const [activeTab, setActiveTab] = useState("overview");

  // Map product IDs to imported images
  const getProductImage = (product) => {
    const imageMap = {
      1: panadolImg,
      2: paracetamolImg,
      3: ibuprofenImg,
      4: vitaminCImg,
      5: coughSyrupImg,
      6: antacidImg,
      7: allergyReliefImg
    };
    return imageMap[product.id] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 pt-20 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-center">Loading pharmacy details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 pt-20 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl text-center">
          <p className="text-red-500 mb-2">Error loading pharmacy details</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Mini OTC Products Component for Overview
  const MiniOTCProducts = () => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Popular Products</h2>
        <button
          onClick={() => setActiveTab("products")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {otcProducts?.slice(0, 3).map((product) => {
          const productImage = getProductImage(product);
          
          return (
            <div key={product.id} className="bg-white/60 rounded-lg p-3 border border-white/30 hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="w-full h-24 bg-gray-100 rounded-md mb-3 overflow-hidden">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                )}
                {/* Fallback if image fails to load */}
                <div className="w-full h-full hidden items-center justify-center">
                  <Package size={24} className="text-gray-400" />
                </div>
              </div>
              
              {/* Product Info */}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-800 text-sm truncate">{product.name}</h4>
                <p className="text-xs text-gray-600">{product.brand}</p>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-bold text-sm">Rs. {product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                  product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Mini Reviews Component for Overview
  const MiniReviews = () => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Recent Reviews</h2>
        <button
          onClick={() => setActiveTab("reviews")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All <ArrowRight size={16} />
        </button>
      </div>
      
      {reviews?.length > 0 ? (
        <div className="space-y-4">
          {reviews.slice(0, 2).map((review) => (
            <div key={review.id} className="bg-white/60 rounded-lg p-4 border border-white/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 text-sm">{review.userName}</h5>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={`${
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 text-sm line-clamp-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <MessageCircle size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">No reviews yet.</p>
        </div>
      )}
    </div>
  );

  // Mini Services Component for Overview
  const MiniServices = () => {
    // Example service data; replace with real data if available
    const services = [
      {
        id: "delivery",
        label: "Home Delivery",
        description: "Free delivery within 5km radius",
        icon: <Truck size={20} className="text-green-500" />,
        available: pharmacy?.hasDelivery,
      },
      {
        id: "24hr",
        label: "24/7 Service",
        description: "Round-the-clock pharmacy services",
        icon: <Clock size={20} className="text-green-500" />,
        available: pharmacy?.has24HourService,
      },
      {
        id: "insurance",
        label: "Insurance Coverage",
        description: "Accepts major insurance plans",
        icon: <ShieldCheck size={20} className="text-green-500" />,
        available: pharmacy?.acceptsInsurance,
      },
      {
        id: "vaccines",
        label: "Vaccination Services",
        description: "COVID-19, flu, and other vaccines",
        icon: <Syringe size={20} className="text-green-500" />,
        available: pharmacy?.hasVaccinations,
      },
    ];

    const availableServices = services.filter(s => s.available);

    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          <button
            onClick={() => setActiveTab("services")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        {availableServices.length > 0 ? (
          <div className="space-y-4">
            {availableServices.map(service => (
              <div key={service.id} className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 flex items-center justify-center">
                  {service.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 text-sm flex items-center gap-1">
                    {service.label}
                    <Check size={16} className="text-green-500" />
                  </h4>
                  <p className="text-xs text-gray-700">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Clock size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">No services available.</p>
          </div>
        )}
      </div>
    );
  };

  // Mini Contact Info Component for Overview (separated from opening hours)
  const MiniContactInfo = () => (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contact Info</h2>
        <button
          onClick={() => setActiveTab("contact")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
            <p className="text-gray-600">{pharmacy.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Phone size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
            <a href={`tel:${pharmacy.phone}`} className="text-gray-600 hover:text-blue-600 transition-colors">
              {pharmacy.phone}
            </a>
          </div>
        </div>

        {pharmacy.email && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
              <a href={`mailto:${pharmacy.email}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                {pharmacy.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mini Opening Hours Component for Overview (separated component)
  const MiniOpeningHours = () => (
    <OpeningHours 
      pharmacy={pharmacy} 
      showTitle={true} 
      miniView={true} 
      className=""
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 pt-20 pb-12">
      {/* Floating background elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 left-20 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-green-500/5 rounded-full blur-lg animate-pulse"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            to="/find-pharmacy" 
            className="flex items-center space-x-2 sm:space-x-3 text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 px-3 sm:px-4 py-2 rounded-lg group w-fit"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium text-sm sm:text-base">Back to Pharmacy Search</span>
          </Link>
        </div>

        {/* Profile Header */}
        <ProfileHeader pharmacy={pharmacy} />

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
            <div className="flex overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "reviews", label: "Reviews" },
                { id: "products", label: "OTC Products" },
                { id: "services", label: "Services" },
                { id: "contact", label: "Info" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Mini Products and Reviews Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MiniOTCProducts />
                <MiniReviews />
              </div>

              {/* Services Row */}
              <div className="grid grid-cols-3 gap-8">
                <MiniServices />
                <MiniContactInfo />
                <MiniOpeningHours />
              </div>
            </div>
          )}
          
          {activeTab === "reviews" && <ReviewsSection reviews={reviews} pharmacy={pharmacy} />}
          
          {activeTab === "products" && <OTCStorefront products={otcProducts} pharmacy={pharmacy} />}
          
          {activeTab === "contact" && <ContactInfo pharmacy={pharmacy} />}

          {activeTab === "services" && <ServicesSection pharmacy={pharmacy} />}
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;