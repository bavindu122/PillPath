import api from "../api";
import { tokenUtils } from "../../utils/tokenUtils";

const withAdminAuth = () => {
  const adminHeaders = tokenUtils.getAdminAuthHeaders();
  // Fallback to user token if admin token is not set
  const userHeaders = adminHeaders.Authorization
    ? {}
    : tokenUtils.getAuthHeaders();
  return {
    headers: {
      ...adminHeaders,
      ...userHeaders,
    },
  };
};

export async function listOrderPayments({
  pharmacyId,
  month,
  year,
  settlementChannel,
  q,
  page = 1,
  size = 10,
} = {}) {
  const params = new URLSearchParams();
  if (pharmacyId) params.set("pharmacyId", pharmacyId);
  if (month && month !== "All") params.set("month", String(month));
  if (year && year !== "All") params.set("year", String(year));
  if (settlementChannel) params.set("settlementChannel", settlementChannel);
  if (q) params.set("q", q);
  params.set("page", String(page));
  params.set("size", String(size));
  const { data } = await api.get(
    `/admin/order-payments?${params.toString()}`,
    withAdminAuth()
  );
  return data;
}

export async function listCommissions({
  pharmacyId,
  month, // "MM/YYYY"
  year, // "YYYY"
  status,
  page = 1,
  size = 10,
} = {}) {
  const params = new URLSearchParams();
  if (pharmacyId) params.set("pharmacyId", pharmacyId);
  if (month && month !== "All") params.set("month", month);
  if (year && year !== "All") params.set("year", String(year));
  if (status) params.set("status", status);
  params.set("page", String(page));
  params.set("size", String(size));
  const { data } = await api.get(
    `/admin/commissions?${params.toString()}`,
    withAdminAuth()
  );
  return data;
}

export async function updateCommissionStatus(commissionId, body) {
  const { data } = await api.patch(
    `/admin/commissions/${encodeURIComponent(commissionId)}`,
    body,
    withAdminAuth()
  );
  return data;
}

export async function listPayouts({
  pharmacyId,
  month, // "MM/YYYY"
  year,
  status,
  page = 1,
  size = 10,
} = {}) {
  const params = new URLSearchParams();
  if (pharmacyId) params.set("pharmacyId", pharmacyId);
  if (month && month !== "All") params.set("month", month);
  if (year && year !== "All") params.set("year", String(year));
  if (status) params.set("status", status);
  params.set("page", String(page));
  params.set("size", String(size));
  const { data } = await api.get(
    `/admin/payouts?${params.toString()}`,
    withAdminAuth()
  );
  return data;
}

export async function uploadPayoutReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/admin/uploads/payout-receipts`, formData, {
    ...withAdminAuth(),
    headers: {
      ...withAdminAuth().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return data; // FileUploadResult
}

export async function updatePayout(payoutId, body) {
  const { data } = await api.patch(
    `/admin/payouts/${encodeURIComponent(payoutId)}`,
    body,
    withAdminAuth()
  );
  return data;
}

export default {
  listOrderPayments,
  listCommissions,
  updateCommissionStatus,
  listPayouts,
  uploadPayoutReceipt,
  updatePayout,
};
