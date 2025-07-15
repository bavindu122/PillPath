import React, { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Filter, Plus } from "lucide-react";

const ReviewsSection = ({ reviews, pharmacy }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const sortedReviews = reviews?.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  }) || [];

  const filteredReviews = filterRating === "all" 
    ? sortedReviews 
    : sortedReviews.filter(review => review.rating === parseInt(filterRating));

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Customer Reviews ({reviews?.length || 0})
      </h2>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white/60 rounded-xl p-6 border border-white/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <ThumbsUp size={14} />
                  Helpful ({review.helpfulCount || 0})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No reviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;