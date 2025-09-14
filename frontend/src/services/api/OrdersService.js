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
    throw new Error(msg);
  }
  return data;
}

/**
 * PlaceOrderRequestDTO shape (client side):
 * {
 *   prescriptionCode: string,
 *   pharmacies: [ { pharmacyId: number, items: [ { previewItemId: number, quantity: number } ] } ],
 *   payment: { method: 'CASH' | 'CARD', currency: 'LKR', amount?: number }
 * }
 */
export async function createOrder(body) {
  return request("orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getOrder(orderCode) {
  if (!orderCode) throw new Error("orderCode required");
  return request(`orders/${encodeURIComponent(orderCode)}`, { method: "GET" });
}

export default { createOrder, getOrder };
