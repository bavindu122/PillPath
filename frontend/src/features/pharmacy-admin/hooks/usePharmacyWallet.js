import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import PharmacyWalletService from "../../../services/api/PharmacyWalletService";

export default function usePharmacyWallet({
  page = 0,
  size = 10,
  type,
  from,
  to,
  pharmacyId: pharmacyIdOverride,
} = {}) {
  const { user, isAuthenticated, isPharmacyAdmin } = useAuth();
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user_data") || "{}");
    } catch {
      return {};
    }
  }, []);
  const derivedId = user?.pharmacyId || user?.pharmacy?.id;
  const pharmacyId =
    pharmacyIdOverride ??
    derivedId ??
    storedUser?.pharmacyId ??
    storedUser?.pharmacy?.id;
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filters = useMemo(
    () => ({ page, size, type, from, to }),
    [page, size, type, from, to]
  );

  const load = useCallback(async () => {
    if (!isAuthenticated || !isPharmacyAdmin) return;
    if (!pharmacyId) {
      setError("Missing pharmacyId for wallet queries");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [bal, tx] = await Promise.all([
        PharmacyWalletService.getPharmacyBalance(pharmacyId),
        PharmacyWalletService.getPharmacyTransactions(pharmacyId, filters),
      ]);
      // Normalize balance schema (supports both {available,pending,total,lastUpdated} and {balance,updatedAt})
      const normalizedBalance = {
        ...bal,
        currency: bal?.currency || "LKR",
        available:
          bal?.available != null
            ? Number(bal.available)
            : Number(bal?.balance ?? 0),
        pending: Number(bal?.pending ?? 0),
        total: bal?.total != null ? Number(bal.total) : undefined,
        lastUpdated: bal?.lastUpdated || bal?.updatedAt,
      };
      setBalance(normalizedBalance);
      const raw = Array.isArray(tx?.content)
        ? tx.content
        : Array.isArray(tx?.transactions)
        ? tx.transactions
        : Array.isArray(tx)
        ? tx
        : [];
      // Normalize transactions to a consistent shape
      const normalizedTx = raw.map((t) => {
        const amt = Number(t.amount ?? 0);
        const direction = t.direction || (amt >= 0 ? "CREDIT" : "DEBIT");
        return {
          ...t,
          transactionId: t.transactionId || t.id || t.externalKey,
          amount: amt,
          direction,
          description: t.description || t.note || t.details || "",
          createdAt: t.createdAt || t.date || t.timestamp,
          balanceAfter: Number(t.balanceAfter ?? t.balance ?? 0),
          currency: t.currency || "LKR",
        };
      });
      setTransactions(normalizedTx);
      setPageInfo({
        page: tx?.page ?? page,
        size: tx?.size ?? tx?.pageSize ?? size,
        totalElements: tx?.totalElements ?? normalizedTx.length,
        totalPages: tx?.totalPages ?? 1,
      });
    } catch (e) {
      setError(e?.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isPharmacyAdmin, pharmacyId, filters, page, size]);

  useEffect(() => {
    load();
  }, [load]);

  const moneyIn = useMemo(() => {
    // Treat positive amounts as CREDIT if direction missing
    return transactions
      .filter((t) => t.direction === "CREDIT" || Number(t.amount) > 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
  }, [transactions]);

  const moneyOut = useMemo(() => {
    // Debits decrease balance; amount may be negative already
    return transactions
      .filter((t) => t.direction === "DEBIT" || Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0);
  }, [transactions]);

  return {
    pharmacyId,
    balance,
    transactions,
    pageInfo,
    moneyIn,
    moneyOut,
    loading,
    error,
    reload: load,
  };
}
