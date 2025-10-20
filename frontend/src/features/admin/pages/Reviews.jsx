import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import ModalWrapper from "../components/popup/ModalWrapper";
import AdminService from "../../../services/api/AdminService";
import { Trash2, Star } from "lucide-react";

// Note: This page lists all reviews system-wide for admins. We assume a backend endpoint exists:
// GET admin/reviews?page&pageSize&search&stars&sort
// DELETE admin/reviews/{reviewId}

const DEFAULT_PAGE_SIZE = 10;

export default function Reviews() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [targetReview, setTargetReview] = useState(null);

  const filterOptions = ["All", "5", "4", "3", "2", "1"]; // Stars

  const sortOptions = ["Newest", "Oldest", "Highest", "Lowest"];

  const apiSort = useMemo(() => sort.toLowerCase(), [sort]);
  const starsParam = useMemo(
    () => (starFilter === "All" ? undefined : starFilter),
    [starFilter]
  );

  const displayedItems = useMemo(() => {
    // Client-side fallback filtering/sorting to ensure UX works even if server ignores params
    let arr = Array.isArray(items) ? [...items] : [];

    const lcSearch = (searchTerm || "").trim().toLowerCase();
    if (lcSearch) {
      arr = arr.filter((r) => {
        const customer =
          r.customerName ||
          r.customer?.name ||
          r.customer?.fullName ||
          r.customer?.username ||
          String(r.customerId || r.customer?.id || "");
        const pharmacy =
          r.pharmacyName ||
          r.pharmacy?.name ||
          r.pharmacy?.displayName ||
          String(r.pharmacyId || r.pharmacy?.id || "");
        const reviewText = r.comment ?? r.review ?? r.text ?? "";
        return (
          String(customer).toLowerCase().includes(lcSearch) ||
          String(pharmacy).toLowerCase().includes(lcSearch) ||
          String(reviewText).toLowerCase().includes(lcSearch)
        );
      });
    }

    if (starsParam) {
      const want = Number(starsParam);
      arr = arr.filter((r) => {
        const rating = Number(r.rating ?? r.stars ?? r.score ?? NaN);
        return (
          Number.isFinite(want) && Number.isFinite(rating) && rating === want
        );
      });
    }

    const toTs = (r) => {
      const raw = r.createdAt || r.created_at || r.createdOn || r.created;
      if (!raw) return 0;
      try {
        // Accept both ISO and formatted without T
        const s = String(raw);
        const d = new Date(s.includes("T") ? s : s.replace(" ", "T"));
        const t = d.getTime();
        return Number.isFinite(t) ? t : 0;
      } catch {
        return 0;
      }
    };
    const toRating = (r) => Number(r.rating ?? r.stars ?? r.score ?? NaN);

    const key = apiSort;
    if (key === "newest") arr.sort((a, b) => toTs(b) - toTs(a));
    else if (key === "oldest") arr.sort((a, b) => toTs(a) - toTs(b));
    else if (key === "highest")
      arr.sort((a, b) => (toRating(b) || 0) - (toRating(a) || 0));
    else if (key === "lowest")
      arr.sort((a, b) => (toRating(a) || 0) - (toRating(b) || 0));

    return arr;
  }, [items, searchTerm, starsParam, apiSort]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        // Prefer server-driven search/filter/sort/paging if available
        const params = {
          page,
          pageSize,
          ...(searchTerm ? { search: searchTerm } : {}),
          ...(starsParam ? { rating: starsParam, stars: starsParam } : {}),
          ...(apiSort ? { sort: apiSort } : {}),
        };
        const data = await AdminService.getReviews(params);

        if (cancelled) return;
        // Normalize response: expect { items:[], total:number }
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        setItems(list);
        setTotal(Number(data?.total ?? list.length));
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load reviews");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, searchTerm, starsParam, apiSort]);

  const openDelete = (review) => {
    setTargetReview(review);
    setConfirmOpen(true);
  };

  const closeDelete = () => {
    setConfirmOpen(false);
    setTargetReview(null);
  };

  const handleConfirmDelete = async () => {
    if (!targetReview) return;
    setDeleting(true);
    try {
      await AdminService.deleteReview(targetReview.id || targetReview.reviewId);
      // Remove locally and adjust total
      setItems((prev) =>
        prev.filter(
          (r) =>
            (r.id || r.reviewId) !== (targetReview.id || targetReview.reviewId)
        )
      );
      setTotal((t) => Math.max(0, t - 1));
      closeDelete();
    } catch (e) {
      alert(e?.message || "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={Star}
        title="Reviews"
        subtitle="Manage customer reviews"
      />

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={(v) => {
          setPage(1);
          setSearchTerm(v);
        }}
        filterValue={starFilter}
        setFilterValue={(v) => {
          setPage(1);
          setStarFilter(v);
        }}
        filterOptions={filterOptions}
        placeholder="Search by customer or pharmacy"
        filterLabel="Stars"
      />

      {/* Sort and page size */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-sm text-gray-600 mr-2">Sort:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            {sortOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 mr-2">Page size:</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pharmacy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No reviews found
                  </td>
                </tr>
              ) : (
                displayedItems.map((r) => {
                  const customerName =
                    r.customerName ||
                    r.customer?.name ||
                    r.customer?.fullName ||
                    r.customer?.username ||
                    `#${r.customerId || r.customer?.id || "-"}`;
                  const pharmacyName =
                    r.pharmacyName ||
                    r.pharmacy?.name ||
                    r.pharmacy?.displayName ||
                    `#${r.pharmacyId || r.pharmacy?.id || "-"}`;
                  const rating = r.rating ?? r.stars ?? r.score ?? "-";
                  const review = r.comment ?? r.review ?? r.text ?? "";
                  const createdAtRaw =
                    r.createdAt || r.created_at || r.createdOn || r.created;
                  const createdAt = createdAtRaw
                    ? String(createdAtRaw)
                        .replace("T", " ")
                        .replace(/\.\d+Z?$/, "")
                    : "";
                  return (
                    <tr key={r.id || r.reviewId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pharmacyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rating}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-700 max-w-xl truncate"
                        title={review}
                      >
                        {review}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md"
                          onClick={() => openDelete(r)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total: {total} {total === 1 ? "review" : "reviews"}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">Page {page}</span>
            <button
              className="px-3 py-1.5 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || items.length < pageSize}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmOpen && (
        <ModalWrapper onClose={closeDelete} showClose={false}>
          <h3 className="text-lg font-semibold text-gray-900">
            Delete review?
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Are you sure you want to delete this review? This action is
            typically taken for inappropriate, offensive, or irrelevant content.
            This cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeDelete}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
