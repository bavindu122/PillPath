const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, config);
  const ct = res.headers.get("content-type");
  const data =
    ct && ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = data && data.message ? data.message : `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/**
 * Submit a review for a pharmacy in the context of an order.
 * Assumption: Backend accepts POST at
 *   POST /orders/{orderCode}/pharmacies/{pharmacyId}/reviews
 * Body: { rating: number(1-5), comment?: string }
 */
export async function submitPharmacyReview({
  orderCode,
  pharmacyId,
  rating,
  comment,
}) {
  if (!orderCode) throw new Error("orderCode required");
  if (!pharmacyId) throw new Error("pharmacyId required");
  if (!(rating >= 1 && rating <= 5)) throw new Error("rating must be 1-5");
  const trimmed = typeof comment === "string" ? comment.trim() : "";
  if (trimmed.length > 1000)
    throw new Error("comment must be 0-1000 characters");
  return request(
    `orders/${encodeURIComponent(orderCode)}/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/reviews`,
    {
      method: "POST",
      body: JSON.stringify({
        rating,
        ...(trimmed ? { comment: trimmed } : {}),
      }),
    }
  );
}

/**
 * Fetch reviews for a pharmacy with pagination, optional rating filter, and sorting.
 * GET /pharmacies/{pharmacyId}/reviews?Page&PageSize&rating&sort
 * sort: newest|oldest|highest|lowest
 */
export async function getPharmacyReviews({
  pharmacyId,
  page = 1,
  pageSize = 5,
  rating,
  sort = "newest",
} = {}) {
  if (!pharmacyId) throw new Error("pharmacyId required");
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (rating != null && rating !== "all") {
    const r = String(rating);
    params.set("rating", r);
    // also send 'stars' for compatibility with different backends
    params.set("stars", r);
  }
  if (sort) params.set("sort", sort);
  return request(
    `pharmacies/${encodeURIComponent(pharmacyId)}/reviews?${params.toString()}`
  );
}

export default { submitPharmacyReview, getPharmacyReviews };
