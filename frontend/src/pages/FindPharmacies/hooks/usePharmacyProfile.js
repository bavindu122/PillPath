import { useState, useEffect } from "react";

// Mock delay constant
const MOCK_API_DELAY_MS = 1000;

export const usePharmacyProfile = (pharmacyId) => {
  const [pharmacy, setPharmacy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [otcProducts, setOtcProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPharmacyProfile = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY_MS));

        // Mock pharmacy data with enhanced details
        const mockPharmacy = {
          id: parseInt(pharmacyId) || 1,
          name: "HealthFirst Pharmacy",
          address: "123 Medical Lane, Colombo 05",
          lat: 6.9371,
          lng: 79.8712,
          rating: 4.8,
          reviewCount: 127,
          hours: "Open until 10:00 PM",
          isOpen: true,
          phone: "+94 11 234 5678",
          email: "info@healthfirst.lk",
          website: "https://healthfirst.lk",
          hasDelivery: true,
          acceptsInsurance: true,
          has24HourService: false,
          hasVaccinations: true,
          hasConsultation: true,
          multiplePayments: true,
          logo: null, // Will show first letter fallback
          operatingHours: {
            monday: "8:00 AM - 10:00 PM",
            tuesday: "8:00 AM - 10:00 PM",
            wednesday: "8:00 AM - 10:00 PM",
            thursday: "8:00 AM - 10:00 PM",
            friday: "8:00 AM - 10:00 PM",
            saturday: "9:00 AM - 9:00 PM",
            sunday: "10:00 AM - 8:00 PM"
          },
          deliveryHours: "9:00 AM - 9:00 PM",
          consultationHours: "10:00 AM - 6:00 PM",
          vaccinationHours: "By appointment"
        };

        // Mock reviews data
        const mockReviews = [
          {
            id: 1,
            userName: "Sarah Johnson",
            rating: 5,
            date: "2024-07-10",
            comment: "Excellent service! The staff is very knowledgeable and helpful. They always have my medications in stock and the delivery service is reliable.",
            helpfulCount: 12
          },
          {
            id: 2,
            userName: "Michael Chen",
            rating: 4,
            date: "2024-07-08",
            comment: "Good pharmacy with competitive prices. The consultation service is valuable, especially for managing my diabetes medications.",
            helpfulCount: 8
          },
          {
            id: 3,
            userName: "Priya Patel",
            rating: 5,
            date: "2024-07-05",
            comment: "Best pharmacy in the area! They provide excellent customer service and their vaccination services are top-notch. Highly recommended!",
            helpfulCount: 15
          },
          {
            id: 4,
            userName: "David Wilson",
            rating: 3,
            date: "2024-07-02",
            comment: "Decent pharmacy but sometimes the wait time can be long during peak hours. Staff is friendly though.",
            helpfulCount: 5
          },
          {
            id: 5,
            userName: "Amanda Silva",
            rating: 5,
            date: "2024-06-28",
            comment: "Love their home delivery service! Very convenient and they always call to confirm before delivering. Great selection of OTC products too.",
            helpfulCount: 10
          }
        ];

        // Mock OTC products data with actual medication images
        const mockOtcProducts = [
          {
            id: 1,
            name: "Panadol Extra",
            category: "pain-relief",
            price: 450.00,
            description: "Extra strength paracetamol with caffeine for fast pain relief",
            image: "/src/assets/img/meds/panadol.jpg",
            inStock: true,
            rating: 4.5,
            reviewCount: 89,
            brand: "GSK",
            dosage: "500mg + 65mg Caffeine"
          },
          {
            id: 2,
            name: "Piriton Tablets",
            category: "allergy",
            price: 320.00,
            description: "Antihistamine for hay fever, allergies and itchy skin",
            image: "/src/assets/img/meds/piriton.jpg",
            inStock: true,
            rating: 4.3,
            reviewCount: 67,
            brand: "GSK",
            dosage: "4mg"
          },
          {
            id: 3,
            name: "Strepsils Honey & Lemon",
            category: "cold-flu",
            price: 180.00,
            description: "Antibacterial lozenges for sore throat relief",
            image: "/src/assets/img/meds/strepsils.jpg",
            inStock: true,
            rating: 4.6,
            reviewCount: 134,
            brand: "Reckitt",
            dosage: "2.4mg/1.2mg"
          },
          {
            id: 4,
            name: "Ventolin Inhaler",
            category: "respiratory",
            price: 1250.00,
            description: "Salbutamol inhaler for asthma and breathing difficulties",
            image: "/src/assets/img/meds/ventolin.jpg",
            inStock: true,
            rating: 4.8,
            reviewCount: 203,
            brand: "GSK",
            dosage: "100mcg/dose"
          },
          {
            id: 5,
            name: "Nurofen Express",
            category: "pain-relief",
            price: 680.00,
            description: "Fast-acting ibuprofen liquid capsules for pain and inflammation",
            image: "/src/assets/img/meds/nurofen.jpg",
            inStock: false,
            rating: 4.4,
            reviewCount: 156,
            brand: "Reckitt",
            dosage: "200mg"
          },
          {
            id: 6,
            name: "Gaviscon Advance",
            category: "digestive",
            price: 890.00,
            description: "Advanced formula for heartburn and acid indigestion relief",
            image: "/src/assets/img/meds/gaviscon.jpg",
            inStock: true,
            rating: 4.2,
            reviewCount: 98,
            brand: "Reckitt",
            dosage: "500mg/100mg"
          },
          {
            id: 7,
            name: "Sudocrem Antiseptic",
            category: "skincare",
            price: 750.00,
            description: "Healing cream for cuts, grazes, minor burns and skin irritations",
            image: "/src/assets/img/meds/sudocrem.jpg",
            inStock: true,
            rating: 4.7,
            reviewCount: 142,
            brand: "Teva",
            dosage: "Topical Cream"
          },
          {
            id: 8,
            name: "Dettol Antiseptic",
            category: "first-aid",
            price: 450.00,
            description: "Antiseptic liquid for wound cleaning and disinfection",
            image: "/src/assets/img/meds/dettol.jpg",
            inStock: true,
            rating: 4.5,
            reviewCount: 87,
            brand: "Reckitt",
            dosage: "250ml"
          }
        ];

        setPharmacy(mockPharmacy);
        setReviews(mockReviews);
        setOtcProducts(mockOtcProducts);
        setError(null);
      } catch (err) {
        setError("Failed to load pharmacy details. Please try again later.");
        console.error("Error fetching pharmacy profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyProfile();
  }, [pharmacyId]);

  return {
    pharmacy,
    reviews,
    otcProducts,
    loading,
    error
  };
};