import React, { useEffect, useMemo, useState } from "react";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import ReviewsService from "../../../services/api/ReviewsService";

// Format dates like 2025-10-20T12:51:52.011230Z -> 2025-10-20 12:51:52
function formatDateDisplay(input) {
  if (!input) return "";
  const str = String(input);
  // Replace T with space, drop milliseconds and trailing Z/offset
  const replaced = str.replace("T", " ").replace("Z", "");
  // If milliseconds present, cut at first dot
  const noMs = replaced.includes(".") ? replaced.split(".")[0] : replaced;
  // Ensure we only keep up to seconds if more content remains
  const match = noMs.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
  return match ? match[1] : noMs;
}

const ReviewsSection = ({ reviews, pharmacy }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverData, setServerData] = useState({
    items: [],
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0,
  });

  const pharmacyId = pharmacy?.id || pharmacy?.pharmacyId || pharmacy;

  const fetchReviews = async () => {
    if (!pharmacyId) return;
    setLoading(true);
    setError("");
    try {
      const res = await ReviewsService.getPharmacyReviews({
        pharmacyId,
        page: currentPage,
        pageSize,
        rating: filterRating === "all" ? undefined : Number(filterRating),
        sort: sortBy,
      });
      // Expected shape: { items, page, pageSize, total, totalPages }
      setServerData({
        items: Array.isArray(res.items) ? res.items : [],
        page: Number(res.page) || currentPage,
        pageSize: Number(res.pageSize) || pageSize,
        total:
          Number(res.total) ||
          (Array.isArray(res.items) ? res.items.length : 0),
        totalPages: Number(res.totalPages) || 1,
      });
    } catch (e) {
      setError(e?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pharmacyId, currentPage, pageSize, filterRating, sortBy]);

  // Fallback client-side filtering if server doesn't honor rating filter
  const currentReviews = React.useMemo(() => {
    const items = serverData.items || [];
    if (filterRating === "all") return items;
    const target = Number(filterRating);
    if (!Number.isFinite(target)) return items;
    return items.filter((r) => Number(r.rating) === target);
  }, [serverData.items, filterRating]);
  const totalPages = serverData.totalPages || 1;
  const startIndex = (serverData.page - 1) * serverData.pageSize;
  const endIndex = startIndex + currentReviews.length;

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Customer Reviews ({serverData.total || 0})
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={filterRating}
            onChange={(e) => {
              setCurrentPage(1);
              setFilterRating(e.target.value);
            }}
            className="bg-white/80 border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-700"
          >
            <option value="all">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-600">
            Loading reviews…
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/60 rounded-xl p-6 border border-white/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {review.userName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDateDisplay(review.date)}
                    </p>
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

      {/* Pagination */}
      {serverData.total > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {endIndex} of {serverData.total} reviews
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ←
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 text-sm border rounded-lg transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-blue-100 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
