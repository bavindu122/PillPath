import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { pharmacyAdminOrdersService } from "../services/ordersService";

const useOrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // ✅ Helper function to determine order type from order code
  const getOrderTypeFromCode = (orderCode) => {
    if (!orderCode) return "unknown";
    const code = orderCode.toString().toUpperCase();
    if (code.startsWith("PORD")) return "prescription";
    if (code.startsWith("OTC")) return "otc";
    return "unknown";
  };

  // Load pharmacy orders from backend
  const loadOrders = useCallback(async () => {
    if (!isAuthenticated || !isPharmacyAdmin || !pharmacyId) {
      setOrders([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
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
      setError(e.message || "Failed to load orders");
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

  // ✅ UPDATED: Apply filters and search with correct order type logic
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    return orders.filter((order) => {
      // 1. Search filter - search in customer name, order code, and items
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        const customerName = (
          order.customer?.name ||
          order.patient?.name ||
          order.patientName ||
          order.customerName ||
          ""
        ).toLowerCase();
        const customerEmail = (
          order.customer?.email ||
          order.customerEmail ||
          ""
        ).toLowerCase();
        const idStr = String(
          order.orderCode ||
          order.orderNumber ||
          order.id ||
          order.orderId ||
          ""
        ).toLowerCase();
        const itemsArr = Array.isArray(order.items) ? order.items : [];
        const matchesItems = itemsArr.some((item) =>
          (item.name || item.medicineName || "")
            .toLowerCase()
            .includes(searchLower)
        );

        const matchesSearch =
          customerName.includes(searchLower) ||
          customerEmail.includes(searchLower) ||
          idStr.includes(searchLower) ||
          matchesItems;

        if (!matchesSearch) return false;
      }

      // 2. ✅ Order Type filter - Check order code prefix (PORD/OTC)
      if (filters.orderType && filters.orderType !== "all") {
        const orderTypeFromCode = getOrderTypeFromCode(
          order.orderCode || order.orderNumber || order.id
        );
        if (orderTypeFromCode !== filters.orderType) {
          return false;
        }
      }

      // 3. Date range filter
      if (filters.dateRange && filters.dateRange !== "all") {
        const rawDate = order.orderDate || order.createdAt || order.dateCreated;
        const orderDate = rawDate ? new Date(rawDate) : null;
        if (!orderDate) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        let cutoffDate = new Date(today);

        switch (filters.dateRange) {
          case "last7days":
            cutoffDate.setDate(today.getDate() - 7);
            break;
          case "last30days":
            cutoffDate.setDate(today.getDate() - 30);
            break;
          case "last90days":
            cutoffDate.setDate(today.getDate() - 90);
            break;
          default:
            cutoffDate = null;
        }

        if (cutoffDate) {
          const orderDateOnly = new Date(orderDate);
          orderDateOnly.setHours(0, 0, 0, 0);
          if (orderDateOnly < cutoffDate) {
            return false;
          }
        }
      }

      // 4. ✅ Payment method filter
      if (filters.paymentMethod && filters.paymentMethod !== "all") {
        const rawMethod = (
          order.paymentMethod ||
          order.payment?.method ||
          ""
        )
          .toString()
          .toUpperCase();

        if (filters.paymentMethod === "cash") {
          // Check if payment method includes "CASH"
          if (!rawMethod.includes("CASH")) return false;
        } else if (filters.paymentMethod === "credit") {
          // Check if payment method includes "CARD" (CREDIT_CARD, DEBIT_CARD)
          if (!rawMethod.includes("CARD")) return false;
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





