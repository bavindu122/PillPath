import { tokenUtils } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

async function doFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...tokenUtils.getAuthHeaders(),
    },
    ...options,
  });
  const contentType = res.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await res.json()
      : await res.text();
  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" ? data : `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

export const submissionItemsService = {
  async list(submissionId) {
    const url = `${API_BASE_URL}/prescriptions/pharmacist/submissions/${submissionId}/items`;
    return doFetch(url);
  },
  async add(submissionId, item) {
    const url = `${API_BASE_URL}/prescriptions/pharmacist/submissions/${submissionId}/items`;
    return doFetch(url, { method: "POST", body: JSON.stringify(item) });
  },
  async update(submissionId, itemId, partial) {
    const url = `${API_BASE_URL}/prescriptions/pharmacist/submissions/${submissionId}/items/${itemId}`;
    return doFetch(url, { method: "PUT", body: JSON.stringify(partial) });
  },
  async remove(submissionId, itemId) {
    const url = `${API_BASE_URL}/prescriptions/pharmacist/submissions/${submissionId}/items/${itemId}`;
    return doFetch(url, { method: "DELETE" });
  },
  async claim(submissionId) {
    const url = `${API_BASE_URL}/prescriptions/pharmacist/${submissionId}/claim`;
    return doFetch(url, { method: "POST" });
  },
};
