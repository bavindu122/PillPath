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

export async function getPharmacyBalance(pharmacyId) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  return request(
    `wallets/pharmacies/${encodeURIComponent(pharmacyId)}/balance`,
    {
      method: "GET",
    }
  );
}

export async function getPharmacyTransactions(
  pharmacyId,
  { page = 0, size = 10, type, from, to } = {}
) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (type) params.set("type", String(type));
  if (from) params.set("from", String(from));
  if (to) params.set("to", String(to));
  return request(
    `wallets/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/transactions?${params.toString()}`,
    { method: "GET" }
  );
}

export async function getPharmacyTransaction(pharmacyId, transactionId) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  if (!transactionId) throw new Error("transactionId is required");
  return request(
    `wallets/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/transactions/${encodeURIComponent(transactionId)}`,
    { method: "GET" }
  );
}

export async function getPharmacyPayouts(
  pharmacyId,
  { page = 0, size = 10 } = {}
) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  return request(
    `wallets/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/payouts?${params.toString()}`,
    { method: "GET" }
  );
}

export async function getPharmacyPayout(pharmacyId, payoutId) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  if (!payoutId) throw new Error("payoutId is required");
  return request(
    `wallets/pharmacies/${encodeURIComponent(
      pharmacyId
    )}/payouts/${encodeURIComponent(payoutId)}`,
    { method: "GET" }
  );
}

export default {
  getPharmacyBalance,
  getPharmacyTransactions,
  getPharmacyTransaction,
  getPharmacyPayouts,
  getPharmacyPayout,
};
