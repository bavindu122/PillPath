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
 * New backend endpoint expects (POST /api/orders):
 * {
 *   prescriptionCode: string,
 *   paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'DIGITAL_WALLET' | 'INSURANCE',
 *   pharmacies: [
 *     {
 *       pharmacyId: number,
 *       note?: string,
 *       items: [ { submissionId: number, quantity: number } ]
 *     }
 *   ]
 * }
 * We now send exactly this structure. (Base path still uses configured API_BASE_URL + 'orders').
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

/**
 * List current user's orders.
 * Backward-compatible signature:
 *  - listMyOrders(true|false) -> toggles includeItems (legacy)
 *  - listMyOrders({ includeItems?: boolean, type?: 'all'|'prescription'|'otc' })
 *    -> supports new unified endpoint filter
 */
export async function listMyOrders(options = false) {
  // Backward compatibility: boolean means includeItems
  let includeItems = false;
  let type;
  if (typeof options === "boolean") {
    includeItems = options;
  } else if (options && typeof options === "object") {
    includeItems = !!options.includeItems;
    type = options.type;
  }

  const params = new URLSearchParams();
  if (includeItems) params.append("includeItems", "true");
  if (type) params.append("type", type);
  const qs = params.toString();
  return request(`orders/my${qs ? `?${qs}` : ""}`, { method: "GET" });
}

export async function pay(orderCode, body) {
  if (!orderCode) throw new Error("orderCode required");
  return request(`orders/${encodeURIComponent(orderCode)}/pay`, {
    method: "POST",
    body: JSON.stringify(body || {}),
  });
}

export default { createOrder, getOrder, listMyOrders, pay };
