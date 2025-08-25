import { tokenUtils } from "../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

class PrescriptionService {
  // Upload prescription image with JSON metadata
  async uploadPrescription(file, meta) {
    if (!file) throw new Error("Prescription image is required");
    if (!meta || !meta.pharmacyId) throw new Error("pharmacyId is required");

    const url = `${API_BASE_URL}/prescriptions/upload`;

    const form = new FormData();
    form.append("file", file);
    // Attach JSON part exactly as backend expects: key 'meta'
    const metaBlob = new Blob([JSON.stringify(meta)], {
      type: "application/json",
    });
    form.append("meta", metaBlob);

    const headers = {
      ...tokenUtils.getAuthHeaders(),
      // Do NOT set Content-Type; browser will set multipart boundary
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: form,
    });

    const contentType = res.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      const message =
        (data && data.message) || (data && data.error) || `HTTP ${res.status}`;
      throw new Error(message);
    }

    return data; // Expected: { success, prescription, message }
  }
}

export default new PrescriptionService();
