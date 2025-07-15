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
          shours: "8:00 AM",
          hours: "10:00 PM",
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

        // Mock OTC products data with actual medication images from meds folder
        const mockOtcProducts = [
          {
            id: 1,
            name: "Panadol Extra",
            category: "pain-relief",
            price: 450.00,
            description: "Extra strength paracetamol with caffeine for fast pain relief",
            image: "/src/assets/img/meds/Panadol.jpg",
            inStock: true,
            rating: 4.5,
            reviewCount: 89,
            brand: "GSK",
            dosage: "500mg + 65mg Caffeine"
          },
          {
            id: 2,
            name: "Paracetamol Tablets",
            category: "pain-relief",
            price: 320.00,
            description: "Standard paracetamol tablets for pain and fever relief",
            image: "/src/assets/img/meds/paracetamol.webp",
            inStock: true,
            rating: 4.3,
            reviewCount: 67,
            brand: "Generic",
            dosage: "500mg"
          },
          {
            id: 3,
            name: "Ibuprofen Tablets",
            category: "pain-relief",
            price: 380.00,
            description: "Anti-inflammatory pain relief for headaches, muscle pain and arthritis",
            image: "/src/assets/img/meds/Ibuprofen.jpg",
            inStock: true,
            rating: 4.6,
            reviewCount: 134,
            brand: "Advil",
            dosage: "200mg"
          },
          {
            id: 4,
            name: "Vitamin C Tablets",
            category: "vitamins",
            price: 650.00,
            description: "High strength vitamin C for immune system support",
            image: "/src/assets/img/meds/Vitamin_c.jpg",
            inStock: true,
            rating: 4.8,
            reviewCount: 203,
            brand: "Nature's Way",
            dosage: "1000mg"
          },
          {
            id: 5,
            name: "Cough Syrup",
            category: "cold-flu",
            price: 480.00,
            description: "Effective cough suppressant syrup for dry and wet coughs",
            image: "/src/assets/img/meds/cough_syrup.jpg",
            inStock: false,
            rating: 4.4,
            reviewCount: 156,
            brand: "Benadryl",
            dosage: "100ml"
          },
          {
            id: 6,
            name: "Antacid Tablets",
            category: "digestive",
            price: 290.00,
            description: "Fast-acting antacid tablets for heartburn and acid indigestion relief",
            image: "/src/assets/img/meds/Antacid.jpg",
            inStock: true,
            rating: 4.2,
            reviewCount: 98,
            brand: "Tums",
            dosage: "750mg"
          },
          {
            id: 7,
            name: "Allergy Relief Tablets",
            category: "allergy",
            price: 420.00,
            description: "Antihistamine tablets for hay fever, pet allergies and skin reactions",
            image: "/src/assets/img/meds/allergy_relief.jpg",
            inStock: true,
            rating: 4.7,
            reviewCount: 142,
            brand: "Claritin",
            dosage: "10mg"
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