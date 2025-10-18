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
      // Figure out the correct ID to use for the review route.
      // Prefer submissionId for review (needed for items CRUD), then fallback to id, then prescriptionId.
      const reviewId = item.submissionId ?? item.id ?? item.prescriptionId;

      return {
        id: item.submissionId ?? item.id ?? reviewId,
        submissionId: item.submissionId,
        reviewId,
        code: item.prescriptionCode,
        // Prefer the actual customer name; fallback to code if name is absent
        patientName: item.customerName || item.prescriptionCode,
        customerName: item.customerName || item.prescriptionCode,
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
    // Prefer pharmacist submission detail endpoint; fallback to legacy pharmacy endpoint if needed
    let url = `${API_BASE_URL}/prescriptions/pharmacist/submissions/${id}`;
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
      // If not found on submissions endpoint, try pharmacy endpoint as a fallback
      if (res.status === 404) {
        const res2 = await fetch(
          `${API_BASE_URL}/prescriptions/pharmacy/${id}`,
          {
            headers: { ...tokenUtils.getAuthHeaders() },
          }
        );
        const contentType2 = res2.headers.get("content-type");
        const data2 =
          contentType2 && contentType2.includes("application/json")
            ? await res2.json()
            : await res2.text();
        if (!res2.ok) {
          const msg2 =
            (data2 && data2.message) ||
            (typeof data2 === "string" ? data2 : `HTTP ${res2.status}`);
          throw new Error(msg2);
        }
        return data2;
      } else {
        const msg =
          (data && data.message) ||
          (typeof data === "string" ? data : `HTTP ${res.status}`);
        throw new Error(msg);
      }
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

  // Update submission status via backend
  async updateStatus(id, status) {
    const url = `${API_BASE_URL}/prescriptions/${id}/status`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...tokenUtils.getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    // Expect 200 and json body like { id, status }
    if (res.status === 200) {
      const data = await res.json().catch(() => ({}));
      return data;
    }

    // Provide clearer messages for common cases
    if (res.status === 409) {
      throw new Error(
        "Submission is not editable right now (locked or claimed by another pharmacist)."
      );
    }

    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to update status (HTTP ${res.status})`);
  },

  // Delete a submission via backend
  async deleteSubmission(id) {
    const url = `${API_BASE_URL}/prescriptions/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...tokenUtils.getAuthHeaders(),
      },
    });

    if (res.status === 204) return true;

    if (res.status === 409) {
      throw new Error(
        "Cannot delete: this submission is part of an active order."
      );
    }

    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to delete submission (HTTP ${res.status})`);
  },
};
