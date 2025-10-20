import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { pharmacyAdminOrdersService } from "../services/ordersService";

const useOrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "all",
    orderType: "all",
    paymentMethod: "all",
  });
  const { user, isAuthenticated, isPharmacyAdmin } = useAuth();
  const pharmacyId =
    user?.pharmacyId ||
    user?.pharmacy?.id ||
    JSON.parse(localStorage.getItem("user_data") || "{}")?.pharmacyId;

  // Load pharmacy orders from backend
  const loadOrders = useCallback(async () => {
    if (!isAuthenticated || !isPharmacyAdmin || !pharmacyId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const raw = await pharmacyAdminOrdersService.listOrders(pharmacyId);
      const mapped = (Array.isArray(raw) ? raw : []).map((dto) => ({
        id: dto.pharmacyOrderId,
        orderId: dto.pharmacyOrderId,
        orderCode: dto.orderCode,
        orderDate: dto.createdAt,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        status: dto.status,
        customer: {
          name: dto.customerName,
          email: dto.customerEmail,
          phone: dto.customerPhone,
        },
        items: dto.items || [],
        orderType: "prescription",
        subtotal: dto.totals?.subtotal ?? 0,
        tax: dto.totals?.tax ?? 0,
        total: dto.totals?.total ?? 0,
        paymentMethod: dto.payment?.method,
        paymentStatus: dto.payment?.status,
        pharmacist: dto.pharmacyName,
        fees: dto.fees || null,
      }));
      // New API returns most-recent first already, but keep sort as guard
      mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(mapped);
    } catch (e) {
      console.error("Failed to load orders", e);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isPharmacyAdmin, pharmacyId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Update filters
  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Apply filters and search
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    return orders.filter((order) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const customerName = (
          order.customer?.name ||
          order.patient?.name ||
          order.patientName ||
          order.customerName ||
          ""
        ).toLowerCase();
        const idStr = String(
          order.id ||
            order.orderId ||
            order.orderCode ||
            order.orderNumber ||
            ""
        ).toLowerCase();
        const matchesCustomer = customerName.includes(searchLower);
        const matchesId = idStr.includes(searchLower);
        const itemsArr = Array.isArray(order.items) ? order.items : [];
        const matchesItems = itemsArr.some((item) =>
          (item.name || item.medicineName || "")
            .toLowerCase()
            .includes(searchLower)
        );

        if (!matchesCustomer && !matchesId && !matchesItems) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const rawDate = order.orderDate || order.createdAt || order.dateCreated;
        const orderDate = rawDate ? new Date(rawDate) : null;
        if (!orderDate) return false;
        const today = new Date();
        let daysToCompare = 0;

        switch (filters.dateRange) {
          case "last7days":
            daysToCompare = 7;
            break;
          case "last30days":
            daysToCompare = 30;
            break;
          case "last90days":
            daysToCompare = 90;
            break;
          default:
            daysToCompare = 0;
        }

        if (daysToCompare > 0) {
          const cutoffDate = new Date();
          cutoffDate.setDate(today.getDate() - daysToCompare);
          if (orderDate < cutoffDate) {
            return false;
          }
        }
      }

      // Order type filter
      const orderType = (order.orderType || order.type || "")
        .toString()
        .toLowerCase();
      if (filters.orderType !== "all" && orderType !== filters.orderType) {
        return false;
      }

      // Payment method filter (backend may return CASH, CREDIT_CARD, DEBIT_CARD, DIGITAL_WALLET, INSURANCE)
      if (filters.paymentMethod !== "all") {
        const rawMethod = (order.paymentMethod || order.payment?.method || "")
          .toString()
          .toUpperCase();
        const methodNorm = rawMethod.replace(/[ _]/g, "");
        if (filters.paymentMethod === "cash") {
          if (!methodNorm.includes("CASH")) return false;
        } else if (filters.paymentMethod === "credit") {
          // Interpret as card-based (credit/debit)
          if (!methodNorm.includes("CARD")) return false;
        }
      }

      return true;
    });
  }, [orders, searchTerm, filters]);

  // Get a specific order by ID from loaded list only (sync)
  const getOrderById = (orderId) => {
    return (
      orders.find(
        (order) => String(order.id || order.orderId) === String(orderId)
      ) || null
    );
  };

  // Fetch a specific order by ID from backend (async)
  const getOrderDetail = async (orderId) => {
    if (!pharmacyId) throw new Error("Missing pharmacyId");
    try {
      const existing = getOrderById(orderId);
      if (existing && existing.items && existing.fees) return existing;
      const dto = await pharmacyAdminOrdersService.getOrder(
        pharmacyId,
        orderId
      );
      return {
        id: dto.pharmacyOrderId,
        orderId: dto.pharmacyOrderId,
        orderCode: dto.orderCode,
        orderDate: dto.createdAt,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        status: dto.status,
        customer: {
          name: dto.customerName,
          email: dto.customerEmail,
          phone: dto.customerPhone,
        },
        items: (dto.items || []).map((it) => ({
          id: it.itemId,
          name: it.medicineName,
          genericName: it.genericName,
          dosage: it.dosage,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.totalPrice,
          notes: it.notes || "",
          category: "prescription",
        })),
        orderType: "prescription",
        subtotal: dto.totals?.subtotal ?? 0,
        tax: dto.totals?.tax ?? 0,
        total: dto.totals?.total ?? 0,
        paymentMethod: dto.payment?.method,
        paymentStatus: dto.payment?.status,
        pharmacist: dto.pharmacyName,
        pharmacyId: dto.pharmacyId,
        fees: dto.fees || null,
      };
    } catch (e) {
      console.error("Failed to load order detail", e);
      throw e;
    }
  };

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    getOrderById,
    getOrderDetail,
    reload: loadOrders,
  };
};

export default useOrdersData;
