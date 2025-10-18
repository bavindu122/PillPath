const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

async function request(url, options = {}) {
  const config = {
    headers: {
      Accept: "application/json",
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
    const msg =
      (data && data.message) ||
      (typeof data === "string" ? data : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

export const pharmacyAdminOrdersService = {
  async listOrders(pharmacyId, { status } = {}) {
    if (!pharmacyId && pharmacyId !== 0)
      throw new Error("pharmacyId is required");
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    const url = `${API_BASE_URL}/pharmacy-admin/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/orders${qs.toString() ? `?${qs.toString()}` : ""}`;
    return request(url, { method: "GET" });
  },

  async getOrder(pharmacyId, orderId) {
    if (!pharmacyId && pharmacyId !== 0)
      throw new Error("pharmacyId is required");
    if (!orderId && orderId !== 0) throw new Error("orderId is required");
    const url = `${API_BASE_URL}/pharmacy-admin/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/orders/${encodeURIComponent(orderId)}`;
    return request(url, { method: "GET" });
  },
};

export default pharmacyAdminOrdersService;
