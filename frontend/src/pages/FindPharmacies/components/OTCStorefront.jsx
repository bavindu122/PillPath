import React, { useState } from "react";
import { Search, ShoppingCart, Package, Star, Filter } from "lucide-react";

// Import images
import panadolImg from "../../../assets/img/meds/Panadol.jpg";
import paracetamolImg from "../../../assets/img/meds/paracetamol.webp";
import ibuprofenImg from "../../../assets/img/meds/Ibuprofen.jpg";
import vitaminCImg from "../../../assets/img/meds/Vitamin_c.jpg";
import coughSyrupImg from "../../../assets/img/meds/cough_syrup.jpg";
import antacidImg from "../../../assets/img/meds/Antacid.jpg";
import allergyReliefImg from "../../../assets/img/meds/allergy_relief.jpg";

const OTCStorefront = ({ products, pharmacy }) => {
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

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

  const categories = [
    { id: "all", label: "All Products" },
    { id: "pain-relief", label: "Pain Relief" },
    { id: "cold-flu", label: "Cold & Flu" },
    { id: "allergy", label: "Allergy" },
    { id: "digestive", label: "Digestive" },
    { id: "vitamins", label: "Vitamins" },
    { id: "respiratory", label: "Respiratory" },
    { id: "skincare", label: "Skincare" },
    { id: "first-aid", label: "First Aid" }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products?.filter(product => product.category === selectedCategory) || [];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          OTC Products & Pharmacy Store
        </h2>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/80 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => {
            const productImage = getProductImage(product);
            
            return (
              <div key={product.id} className="bg-white/60 rounded-xl p-4 border border-white/30 hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
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
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  {/* Fallback if image fails to load */}
                  <div className="w-full h-full hidden items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                      {product.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
                      product.inStock 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  
                  {/* Brand and Dosage */}
                  <div className="text-xs text-gray-600">
                    <p className="font-medium">{product.brand}</p>
                    <p>{product.dosage}</p>
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={`${
                            star <= Math.floor(product.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-blue-600">
                      Rs. {product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={!product.inStock}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors mt-3"
                  >
                    <ShoppingCart size={14} />
                    {cart[product.id] ? `In Cart (${cart[product.id]})` : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No products available in this category.</p>
          </div>
        )}
      </div>
      
      {/* Cart Summary */}
      {Object.keys(cart).length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-800">
              Cart ({Object.values(cart).reduce((sum, qty) => sum + qty, 0)} items)
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTCStorefront;