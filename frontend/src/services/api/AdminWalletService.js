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

// Global platform commission and fees
export async function getGlobalSettings() {
  return request("admin/wallet/settings", { method: "GET" });
}

export async function updateGlobalSettings(body) {
  // body: { currency, commissionPercent, convenienceFee, version }
  return request("admin/wallet/settings", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// Pharmacy-specific commission overrides
export async function getPharmacyCommission(pharmacyId) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  return request(
    `admin/wallet/commission/pharmacies/${encodeURIComponent(pharmacyId)}`,
    {
      method: "GET",
    }
  );
}

export async function updatePharmacyCommission(pharmacyId, body) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  // body: { commissionPercent, version }
  return request(
    `admin/wallet/commission/pharmacies/${encodeURIComponent(pharmacyId)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    }
  );
}

export async function removePharmacyCommission(pharmacyId) {
  if (!pharmacyId && pharmacyId !== 0)
    throw new Error("pharmacyId is required");
  return request(
    `admin/wallet/commission/pharmacies/${encodeURIComponent(pharmacyId)}`,
    {
      method: "DELETE",
    }
  );
}

export default {
  getGlobalSettings,
  updateGlobalSettings,
  getPharmacyCommission,
  updatePharmacyCommission,
  removePharmacyCommission,
};
