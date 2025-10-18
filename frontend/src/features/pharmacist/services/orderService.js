import { tokenUtils } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// Real data service for pharmacist orders
export const orderService = {
  // GET /api/v1/orders/pharmacy?status=RECEIVED
  async listOrders(status) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const url = `${API_BASE_URL}/orders/pharmacy${qs}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
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

    const list = Array.isArray(data) ? data : [];
    return list.map(mapOrderSummaryFromDTO);
  },

  // GET /api/v1/orders/pharmacy/{id}
  async getOrder(id) {
    const url = `${API_BASE_URL}/orders/pharmacy/${id}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
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

    return mapOrderDetailFromDTO(data);
  },

  // PATCH /api/v1/orders/pharmacy/{id}/status
  async updateStatus(id, status) {
    const url = `${API_BASE_URL}/orders/pharmacy/${id}/status`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...tokenUtils.getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
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
    // Backend returns updated PharmacyOrderDTO
    return mapOrderDetailFromDTO(data);
  },
};

// Mappers from backend DTOs to UI-friendly shapes used by components
function mapOrderSummaryFromDTO(dto) {
  // dto from list endpoint (items omitted)
  const dateObj = dto.createdAt ? new Date(dto.createdAt) : null;
  const date = dateObj ? dateObj.toISOString().slice(0, 10) : "";
  const time = dateObj
    ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return {
    id: dto.pharmacyOrderId,
    orderCode: dto.orderCode,
    patient: {
      name: dto.customerName,
      email: dto.patientEmail || dto.customerEmail,
      phone: dto.patientPhone || dto.customerPhone,
      avatar: undefined,
    },
    type: "Prescription",
    items: dto.itemCount || 0, // Use itemCount from backend
    itemDetails: undefined,
    total: dto.totals?.total,
    currency: dto.totals?.currency,
    date,
    time,
    paymentMethod: dto.payment?.method,
    paymentStatus: dto.payment?.status,
    notes: dto.customerNote ?? null,
    status: (dto.status || "").toString(),
    prescriptionCode: dto.prescriptionCode,
  };
}

function mapOrderDetailFromDTO(dto) {
  const createdAt = dto.createdAt ? new Date(dto.createdAt) : null;
  const updatedAt = dto.updatedAt ? new Date(dto.updatedAt) : null;
  const dateCreated = createdAt ? createdAt.toISOString().slice(0, 10) : "";
  const dateCompleted = dto.completedDate
    ? new Date(dto.completedDate).toISOString().slice(0, 10)
    : dto.status === "HANDED_OVER" && updatedAt
    ? updatedAt.toISOString().slice(0, 10)
    : null;

  return {
    orderNumber: dto.orderCode || String(dto.pharmacyOrderId),
    orderId: dto.pharmacyOrderId,
    patientName: dto.customerName,
    patientEmail: dto.patientEmail || dto.customerEmail,
    patientPhone: dto.patientPhone || dto.customerPhone,
    patientAddress: dto.patientAddress,
    pharmacistName: dto.pharmacyName,
    dateCreated,
    dateCompleted,
    totalAmount: dto.totals?.total,
    currency: dto.totals?.currency,
    paymentMethod: dto.payment?.method,
    paymentStatus: dto.payment?.status,
    paymentReference: dto.payment?.reference,
    status: dto.status,
    prescriptionCode: dto.prescriptionCode,
    prescriptionImageUrl: dto.prescriptionImageUrl || undefined,
    notes: dto.pharmacistNote || dto.customerNote || null,
    pickup: {
      code: dto.pickupCode,
      location: dto.pickupLocation,
      lat: dto.pickupLat ?? null,
      lng: dto.pickupLng ?? null,
    },
    items: (dto.items || []).map((it) => ({
      id: it.itemId,
      name: it.medicineName,
      genericName: it.genericName,
      dosage: it.dosage,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalPrice: it.totalPrice,
      notes: it.notes || null,
      available: typeof it.available !== "undefined" ? it.available : true,
      historicalNote: undefined,
    })),
    itemCount: dto.itemCount || (dto.items || []).length, // Use itemCount from backend
  };
}
