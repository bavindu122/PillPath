// Medicine Service for API integration
// This service would handle API calls to medicine databases like OpenFDA, RxNorm, etc.

class MedicineService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  // Search medicines by name, generic name, or brand
  async searchMedicines(query) {
    try {
      const response = await fetch(`${this.baseURL}/medicines/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }
  }

  // Get detailed information about a specific medicine
  async getMedicineDetails(medicineId) {
    try {
      const response = await fetch(`${this.baseURL}/medicines/${medicineId}`);
      if (!response.ok) {
        throw new Error('Failed to get medicine details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting medicine details:', error);
      throw error;
    }
  }

  // Get drug interactions for a medicine
  async getDrugInteractions(medicineId) {
    try {
      const response = await fetch(`${this.baseURL}/medicines/${medicineId}/interactions`);
      if (!response.ok) {
        throw new Error('Failed to get drug interactions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting drug interactions:', error);
      throw error;
    }
  }

  // Search medicines by therapeutic class
  async getMedicinesByClass(therapeuticClass) {
    try {
      const response = await fetch(`${this.baseURL}/medicines/class/${encodeURIComponent(therapeuticClass)}`);
      if (!response.ok) {
        throw new Error('Failed to get medicines by class');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting medicines by class:', error);
      throw error;
    }
  }

  // Get popular/common medicines
  async getPopularMedicines(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/medicines/popular?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to get popular medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting popular medicines:', error);
      throw error;
    }
  }

  // Mock data for development (will be used when API is not available)
  getMockMedicineData() {
    return [
      {
        id: 1,
        name: "Paracetamol",
        genericName: "Acetaminophen",
        brand: "Tylenol",
        category: "Analgesic",
        dosage: "500mg",
        description: "A pain reliever and fever reducer commonly used for headaches, muscle aches, and fever.",
        uses: [
          "Pain relief (headaches, toothaches, muscle pain)",
          "Fever reduction",
          "Cold and flu symptoms"
        ],
        dosageInstructions: "Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.",
        sideEffects: [
          "Rare allergic reactions",
          "Liver damage (with overdose)",
          "Nausea (uncommon)"
        ],
        precautions: [
          "Do not exceed recommended dose",
          "Avoid alcohol while taking",
          "Consult doctor if pregnant or breastfeeding"
        ],
        interactions: [
          "Warfarin (blood thinner)",
          "Isoniazid (tuberculosis medication)"
        ],
        image: "/src/assets/img/meds/Panadol.jpg"
      },
      {
        id: 2,
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        brand: "Advil, Motrin",
        category: "NSAID",
        dosage: "200mg",
        description: "A nonsteroidal anti-inflammatory drug (NSAID) used to reduce inflammation, pain, and fever.",
        uses: [
          "Pain relief",
          "Inflammation reduction",
          "Fever reduction",
          "Arthritis symptoms"
        ],
        dosageInstructions: "Adults: 1-2 tablets every 4-6 hours with food. Maximum 6 tablets in 24 hours.",
        sideEffects: [
          "Stomach upset",
          "Heartburn",
          "Dizziness",
          "Increased bleeding risk"
        ],
        precautions: [
          "Take with food to reduce stomach irritation",
          "Not recommended during pregnancy (third trimester)",
          "Avoid if allergic to aspirin"
        ],
        interactions: [
          "Blood thinners",
          "ACE inhibitors",
          "Lithium"
        ],
        image: "/src/assets/img/meds/Ibuprofen.jpg"
      },
      {
        id: 3,
        name: "Vitamin C",
        genericName: "Ascorbic Acid",
        brand: "Various",
        category: "Vitamin",
        dosage: "1000mg",
        description: "An essential vitamin that supports immune function and acts as an antioxidant.",
        uses: [
          "Immune system support",
          "Antioxidant protection",
          "Collagen synthesis",
          "Iron absorption enhancement"
        ],
        dosageInstructions: "Adults: 1 tablet daily with meal. Best taken with food.",
        sideEffects: [
          "Stomach upset (high doses)",
          "Diarrhea (high doses)",
          "Kidney stones (very high doses)"
        ],
        precautions: [
          "High doses may cause digestive issues",
          "Consult doctor if history of kidney stones"
        ],
        interactions: [
          "Iron supplements (enhances absorption)",
          "Aluminum-containing antacids"
        ],
        image: "/src/assets/img/meds/Vitamin_c.jpg"
      },
      {
        id: 4,
        name: "Cough Syrup",
        genericName: "Dextromethorphan",
        brand: "Robitussin DM",
        category: "Antitussive",
        dosage: "15mg/5ml",
        description: "A cough suppressant used to treat dry, non-productive coughs.",
        uses: [
          "Dry cough suppression",
          "Cold and flu symptoms",
          "Throat irritation relief"
        ],
        dosageInstructions: "Adults: 10-20ml every 4 hours. Do not exceed 120ml in 24 hours.",
        sideEffects: [
          "Drowsiness",
          "Dizziness",
          "Nausea",
          "Constipation"
        ],
        precautions: [
          "Do not use for productive coughs",
          "Avoid alcohol",
          "May cause drowsiness"
        ],
        interactions: [
          "MAO inhibitors",
          "SSRIs",
          "Sedatives"
        ],
        image: "/src/assets/img/meds/cough_syrup.jpg"
      },
      {
        id: 5,
        name: "Antacid",
        genericName: "Calcium Carbonate",
        brand: "Tums, Rolaids",
        category: "Antacid",
        dosage: "500mg",
        description: "An antacid used to neutralize stomach acid and relieve heartburn and indigestion.",
        uses: [
          "Heartburn relief",
          "Acid indigestion",
          "Upset stomach",
          "Calcium supplementation"
        ],
        dosageInstructions: "Adults: 2-4 tablets as needed. Maximum 7000mg in 24 hours.",
        sideEffects: [
          "Constipation",
          "Gas",
          "Stomach cramps"
        ],
        precautions: [
          "Do not use for more than 2 weeks",
          "Consult doctor if symptoms persist"
        ],
        interactions: [
          "Tetracycline antibiotics",
          "Iron supplements",
          "Digoxin"
        ],
        image: "/src/assets/img/meds/Antacid.jpg"
      }
    ];
  }
}

export default new MedicineService();
