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

export async function listCandidates(prescriptionId, { excludePharmacyId, lat, lng, radiusKm, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (excludePharmacyId != null) params.set("excludePharmacyId", String(excludePharmacyId));
  if (lat != null && lng != null) {
    params.set("lat", String(lat));
    params.set("lng", String(lng));
    if (radiusKm != null) params.set("radiusKm", String(radiusKm));
  }
  if (limit != null) params.set("limit", String(limit));
  if (offset != null) params.set("offset", String(offset));
  return request(`prescriptions/customer/${prescriptionId}/reroute/candidates?${params.toString()}`, { method: "GET" });
}

export async function reroute(prescriptionId, body, { idempotencyKey } = {}) {
  const headers = {};
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  return request(`prescriptions/customer/${prescriptionId}/reroute`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

export default { listCandidates, reroute };
