import { tokenUtils } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const prescriptionService = {
  async loadPrescriptions() {
    const url = `${API_BASE_URL}/prescriptions/pharmacist/queue`;
    const res = await fetch(url, {
      headers: {
        ...tokenUtils.getAuthHeaders(),
      },
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

    // Map backend queue items to UI-friendly shape
    const items = Array.isArray(data) ? data : [];
    return items.map((item) => {
      const dateObj = item.uploadedAt ? new Date(item.uploadedAt) : null;
      const date = dateObj ? dateObj.toISOString().slice(0, 10) : "";
      const time = dateObj
        ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";
      const status = (item.status || "").toLowerCase(); // e.g., PENDING_REVIEW -> pending_review
      const normalizedStatus = status.replace(/\s+/g, "_");
      // Figure out the correct ID to use for the review route. Prefer prescriptionId if present.
      const reviewId = item.prescriptionId ?? item.id ?? item.submissionId;

      return {
        id: item.submissionId ?? item.id ?? reviewId,
        reviewId,
        code: item.prescriptionCode,
        patientName: item.prescriptionCode, // display code in existing title slot
        priority: "Medium Priority", // default until backend provides priority
        time,
        date,
        status: normalizedStatus, // compatible with existing getStatusText/colors
        imageUrl: item.imageUrl,
        estimatedTime: "—",
        note: item.note,
        claimed: !!item.claimed,
        assignedPharmacistId: item.assignedPharmacistId,
      };
    });
  },

  async getPharmacyPrescription(id) {
    const url = `${API_BASE_URL}/prescriptions/pharmacy/${id}`;
    const res = await fetch(url, {
      headers: {
        ...tokenUtils.getAuthHeaders(),
      },
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

    // Return DTO as-is; keys: id, code, customerName, imageUrl, status, items, etc.
    return data;
  },

  // Filter configurations for prescriptions
  getFilterConfig() {
    return {
      defaultSort: "time",
      searchFields: ["patientName", "code"],
      customFilters: {
        // priority kept for UI consistency; backend doesn't provide it
        priority: (item, value) =>
          (item.priority || "").toLowerCase() === value.toLowerCase(),
        status: (item, value) => item.status === value,
      },
      sortFunctions: {
        time: (a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`),
        priority: (a, b) => {
          const priorityOrder = {
            "High Priority": 3,
            "Medium Priority": 2,
            "Low Priority": 1,
          };
          return (
            (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          );
        },
        patient: (a, b) =>
          (a.patientName || "").localeCompare(b.patientName || ""),
      },
    };
  },
};
